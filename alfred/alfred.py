import json


class WorkFlowOptions(object):
    def __init__(self):
        self.items = []

    def add_option(self, option):
        self.items.append(option)

    def print(self):
        print(json.dumps({
            'items': self.items
        }))
