from typing import Dict


class Station(object):
    def __init__(self, station: Dict):
        self.id = None
        self.name = station['name']
        self.links = []
        self.line = None
        self.line_id = station['lineId']
        self.label_id = station['labelId']
        self.board_info = station.get('boardInfo')
        self.link_ids = station['linkIds']
        self.hint = None

        changes = station.get('changes')
        self.closed = changes is not None and changes.get('closed') is not None
        self.is_fully_closed = self.closed

    def set_id(self, station_id):
        self.id = station_id

    def set_line(self, line):
        self.line = line

    def set_links(self, links):
        self.links = links

    def is_fully_closed(self):
        return self.is_fully_closed
