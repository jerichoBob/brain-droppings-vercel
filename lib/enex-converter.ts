// Types for our ENEX data structures
interface NoteAttributes {
    source?: string;
    [key: string]: string | undefined;
}

interface NoteContent {
    enml: string;
    plain: string;
}

interface Note {
    title: string;
    created: string;
    updated: string;
    tags: string[];
    content: NoteContent;
    attributes?: NoteAttributes;
}

interface ExportInfo {
    export_date: string;
    application: string;
    version: string;
    notes: Note[];
}

// XML parsing helper functions
const getRawContent = (contentElement: Element | null): string => {
    if (!contentElement || !contentElement.textContent) {
        return "";
    }
    
    let content = contentElement.textContent;
    // Remove outer CDATA markers
    content = content.replace('<![CDATA[', '').replace(']]>', '');
    // Clean up any XML declarations at the start
    content = content.replace(/<\?xml[^>]+\?>/, '');
    // Clean up DOCTYPE declarations
    content = content.replace(/<!DOCTYPE[^>]+>/, '');
    return content.trim();
};

const extractPlainText = (enmlContent: string): string => {
    if (!enmlContent) {
        return "";
    }
    
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(enmlContent, 'text/xml');
        
        const processElement = (element: Element, level = 0): string => {
            const result: string[] = [];
            
            // Handle text content
            if (element.textContent?.trim()) {
                result.push(element.textContent.trim());
            }
            
            // Process children
            Array.from(element.children).forEach(child => {
                if (child.tagName.toLowerCase() === 'ul') {
                    child.querySelectorAll('li').forEach(li => {
                        const indent = '  '.repeat(level + 1);
                        const liText = li.textContent?.trim();
                        if (liText) {
                            result.push(`${indent}• ${liText}`);
                        }
                    });
                } else if (['div', 'p'].includes(child.tagName.toLowerCase())) {
                    const text = child.textContent?.trim();
                    if (text) {
                        result.push(text);
                    }
                }
            });
            
            return result.join('\n');
        };
        
        return processElement(doc.documentElement);
    } catch (error) {
        // If parsing fails, return basic text extraction
        return enmlContent.replace(/<[^>]+>/g, ' ').trim();
    }
};

export const convertEnexToJson = async (enexContent: string): Promise<ExportInfo> => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(enexContent, 'text/xml');
    const root = doc.documentElement;
    
    const exportInfo: ExportInfo = {
        export_date: root.getAttribute('export-date') || '',
        application: root.getAttribute('application') || '',
        version: root.getAttribute('version') || '',
        notes: []
    };
    
    const notes = root.getElementsByTagName('note');
    Array.from(notes).forEach(note => {
        const titleElement = note.querySelector('title');
        const createdElement = note.querySelector('created');
        const updatedElement = note.querySelector('updated');
        const contentElement = note.querySelector('content');
        
        const rawContent = getRawContent(contentElement);
        
        const noteData: Note = {
            title: titleElement?.textContent || '',
            created: createdElement?.textContent || '',
            updated: updatedElement?.textContent || '',
            tags: Array.from(note.getElementsByTagName('tag')).map(tag => tag.textContent || ''),
            content: {
                enml: rawContent,
                plain: extractPlainText(rawContent)
            }
        };
        
        // Add note attributes if they exist
        const attributes = note.querySelector('note-attributes');
        if (attributes) {
            noteData.attributes = Array.from(attributes.children).reduce((acc: NoteAttributes, child) => {
                if (child.textContent) {
                    acc[child.tagName] = child.textContent;
                }
                return acc;
            }, {});
        }
        
        exportInfo.notes.push(noteData);
    });
    
    return exportInfo;
};

// Usage example in your Next.js API route or component:
export const handleEnexFile = async (file: File): Promise<ExportInfo> => {
    const content = await file.text();
    return convertEnexToJson(content);
};
