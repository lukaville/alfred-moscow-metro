from typing import Dict


class Line(object):
    def __init__(self, line: Dict):
        self.id = None
        self.name = line['name']
        self.color = line['color']

    def set_id(self, line_id):
        self.id = line_id
