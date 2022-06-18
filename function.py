import csv
import pandas as pd 

def csv_list(path):
    
    with open(path, newline='') as f:
        reader = csv.reader(f)
        data = list(reader)

    return data 

def csv_write(path, data):

    with open(path, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(data)


def to_my_notes(note):
    with open('saves/notes.csv', 'w') as f:
        for (key, value) in note.items():
            f.write("%s, %s\n" % (key, value))