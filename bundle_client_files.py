import os

def bundle_files(start_path, output_file):
    ignore_dirs = ['node_modules', 'dist', 'build', 'coverage', '.git', '.vscode', '__pycache__']
    ignore_files = ['package-lock.json', os.path.basename(output_file)]

    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(start_path):
            # Exclude specified directories
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            
            for file in files:
                if file in ignore_files:
                    continue
                
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, start_path)
                
                outfile.write(f"--- {relative_path.replace(os.sep, '/')} ---\n\n")
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as infile:
                        outfile.write(infile.read())
                        outfile.write('\n\n')
                except Exception as e:
                    outfile.write(f"Could not read file: {e}\n\n")

if __name__ == '__main__':
    client_path = os.path.join(os.path.dirname(os.path.abspath(__file__)))
    output_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'client_bundle.txt')
    
    if os.path.isdir(client_path):
        bundle_files(client_path, output_file_path)
        print(f"All files from '{client_path}' have been bundled into '{output_file_path}'")
    else:
        print(f"Error: Directory not found at '{client_path}'")

