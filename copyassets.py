#!/usr/bin/env python3

# why not symlink? because "ng serve" doesn't support it.
# "ng build" does, though...

SRC = {
    "w98w": "projects/w98w/src/assets"
}

DEST = [
    "projects/demo-w98w/src/assets"
]

import os
import shutil
import sys

class GitIgnore(object):
    def __init__(self):
        self.gilines = set()

        for line in open(".gitignore"):
            line = line.strip()
            if line:
                self.gilines.add(line)

    def has(self, folder):
        return folder in self.gilines

def main():
    os.chdir(os.path.dirname(sys.argv[0]))

    for dest in DEST:
        for key, srcpath in SRC.items():
            target = os.path.join(dest, key)
            shutil.rmtree(target, ignore_errors=True)
            shutil.copytree(srcpath, target)

    print("ok")

    gi = GitIgnore()
    gitignore_add = []

    for dest in DEST:
        for srckey in SRC.keys():
            dest_path = f"/{dest}/{srckey}"
            if not gi.has(dest_path):
                gitignore_add.append(dest_path)

    if gitignore_add:
        print()
        print("Add to .gitignore:")
        print()
        for gia in gitignore_add:
            print(f'echo {gia} >> .gitignore')

if __name__ == "__main__":
    main()
