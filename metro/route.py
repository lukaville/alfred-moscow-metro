import copy

from metro.link import Link
from metro.station import Station


class Route(object):
    def __init__(self):
        self._metrics = {
            'time': 0,
            'transfers': 0,
            'hops': 0
        }
        self.id = None
        self._stations = []
        self._links = []
        self._station_ids = []
        self._sealed = False

    def is_sealed(self):
        return self._sealed

    def add_station(self, station: Station):
        if not self.is_sealed():
            self._stations.append(station)
            self._station_ids.append(station.id)
            self._metrics['hops'] += 1

    def get_metrics(self):
        return self._metrics

    def go_through_link(self, link: Link):
        if not self.is_sealed():
            self._links.append(link)
            self._metrics['time'] += link.get_weight_time()
            self._metrics['transfers'] += link.get_weight_transfers()

    def is_station_visited(self, station: Station):
        return station.id in self._station_ids

    def set_id(self, route_id):
        if not self.is_sealed():
            self.id = route_id

    def get_id(self):
        return self.id

    def get_stations(self):
        return self._stations

    def get_links(self):
        return self._links

    def seal(self):
        self._sealed = True

    def unseal(self):
        self._sealed = False

    def clone(self):
        route = Route()
        route._metrics = copy.copy(self.get_metrics())
        route._stations = list(self._stations)
        route._station_ids = list(self._station_ids)
        route._sealed = self._sealed
        route.id = self.id
        route._links = list(self._links)
        return route

    def get_from_station(self):
        return self._stations[0]

    def get_to_station(self):
        return self._stations[-1]

    def __str__(self):
        return str(self._metrics['time']) + " sec.: " + " → ".join([station.__str__() for station in self._stations])
