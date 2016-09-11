from typing import Dict

from metro.station import Station


class Link(object):
    def __init__(self, link: Dict):
        self.id = None
        self.from_station_id = link['fromStationId']
        self.to_station_id = link['toStationId']
        self.weight_time = link['weightTime']
        self.weight_transfer = link['weightTransfer']
        self.type = link['type']

        if self.type == 'transfer':
            self.transfer_id = link['transferId']

        self.from_station = None
        self.to_station = None

    def set_id(self, link_id):
        self.id = link_id

    def set_from_station(self, from_station: Station):
        self.from_station = from_station

    def set_to_station(self, to_station: Station):
        self.to_station = to_station

    def get_opposite_station(self, station: Station):
        if station.id == self.from_station_id:
            return self.to_station
        else:
            return self.from_station

    def get_weight_time(self):
        return self.weight_time

    def get_weight_transfers(self):
        return self.weight_transfer

    def __str__(self):
        return self.from_station.__str__() + " → " + self.to_station.__str__()
