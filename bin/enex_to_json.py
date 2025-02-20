#!/usr/bin/env python3

import xml.etree.ElementTree as ET
import json
import os
import sys
from datetime import datetime
import re
from pathlib import Path
from xml.sax.saxutils import escape

def get_raw_content(content_element):
    """Extract the raw ENML content while preserving all formatting."""
    if content_element is None or content_element.text is None:
        return ""
    
    # Extract the ENML content from within CDATA
    content = content_element.text
    # Remove outer CDATA markers
    content = content.replace('<![CDATA[', '').replace(']]>', '')
    # Clean up any XML declarations at the start
    content = re.sub(r'<\?xml[^>]+\?>', '', content, count=1)
    # Clean up DOCTYPE declarations
    content = re.sub(r'<!DOCTYPE[^>]+>', '', content, count=1)
    return content.strip()

def extract_plain_text(enml_content):
    """Extract plain text content from ENML, preserving basic structure."""
    if not enml_content:
        return ""
    
    try:
        # Parse the ENML content
        root = ET.fromstring(enml_content)
        
        def process_element(element, level=0):
            result = []
            
            # Handle text content
            if element.text and element.text.strip():
                result.append(element.text.strip())
            
            # Process children
            for child in element:
                # Handle lists with proper indentation
                if child.tag == 'ul':
                    for li in child.findall('.//li'):
                        indent = '  ' * (level + 1)
                        li_text = ''.join(li.itertext()).strip()
                        if li_text:
                            result.append(f"{indent}• {li_text}")
                elif child.tag in ['div', 'p']:
                    text = ''.join(child.itertext()).strip()
                    if text:
                        result.append(text)
                
                # Handle tail text
                if child.tail and child.tail.strip():
                    result.append(child.tail.strip())
            
            return '\n'.join(result)
        
        return process_element(root)
    except ET.ParseError:
        # If parsing fails, return a basic text extraction
        return re.sub(r'<[^>]+>', ' ', enml_content).strip()

def convert_enex_to_json(input_file, output_file):
    """Convert Evernote .enex file to JSON format while preserving ENML structure."""
    tree = ET.parse(input_file)
    root = tree.getroot()
    
    export_info = {
        'export_date': root.get('export-date'),
        'application': root.get('application'),
        'version': root.get('version'),
        'notes': []
    }
    
    for note in root.findall('note'):
        raw_content = get_raw_content(note.find('content'))
        
        note_data = {
            'title': note.find('title').text if note.find('title') is not None else '',
            'created': note.find('created').text if note.find('created') is not None else '',
            'updated': note.find('updated').text if note.find('updated') is not None else '',
            'tags': [tag.text for tag in note.findall('tag')],
            'content': {
                'enml': raw_content,  # Preserve exact ENML structure
                'plain': extract_plain_text(raw_content)  # Add plain text version
            }
        }
        
        # Add note attributes if they exist
        attributes = note.find('note-attributes')
        if attributes is not None:
            note_data['attributes'] = {
                child.tag: child.text
                for child in attributes
                if child.text is not None
            }
        
        export_info['notes'].append(note_data)
    
    # Create output directory if it doesn't exist
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    # Write the JSON file with proper formatting
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(export_info, f, indent=2, ensure_ascii=False)

def main():
    if len(sys.argv) != 2:
        print("Usage: python enex_to_json.py <input_enex_file>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' does not exist")
        sys.exit(1)
    
    # Construct output path
    input_path = Path(input_file)
    output_dir = input_path.parent.parent / 'json'
    output_file = output_dir / f"{input_path.stem}.json"
    
    try:
        convert_enex_to_json(input_file, output_file)
        print(f"Successfully converted {input_file} to {output_file}")
    except Exception as e:
        print(f"Error converting file: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
