from metro.link import Link
from metro.station import Station


class Route(object):
    def __init__(self):
        self._metrics = {
            'time': 0,
            'transfers': 0,
            'hops': 0
        }
        self._stations = []
        self._links = []
        self._station_ids = []
        self._sealed = False
        self._id = -1

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
            self._id = route_id

    def get_id(self):
        return self._id

    def get_stations(self):
        return self._stations

    def get_links(self):
        return self._links

    def seal(self):
        self._sealed = True

    def unseal(self):
        self._sealed = False
