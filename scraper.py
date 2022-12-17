import os

import requests


# Creates a folder called "imgs" in the current directory and donwloads all images with the search term in it
class Unsplash:
    def __init__(self, search_term, per_page=20, quality="thumb"):
        self.search_term = search_term
        self.per_page = per_page
        self.quality = quality
        self.headers = {"Accept": "*/*", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-US,en;q=0.5",
                        "Connection": "keep-alive", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0"}

    def set_url(self):
        return f"https://unsplash.com/napi/search?query={self.search_term}&per_page={self.per_page}"

    def make_request(self):
        url = self.set_url()
        return requests.request("GET", url, headers=self.headers)

    def get_data(self):
        self.data = self.make_request().json()

    def save_path(self, name):
        download_dir = "imgs"
        if not os.path.exists(download_dir):
            os.mkdir(download_dir)
        return f"{os.path.join(os.path.realpath(os.getcwd()),download_dir,name)}.jpg"

    def download(self, url, name):
        filepath = self.save_path(name)
        with open(filepath, "wb") as f:
            f.write(requests.request("GET", url, headers=self.headers).content)

    def Scraper(self, pages=1):
        for _ in range(0, pages+1):
            self.make_request()
            self.get_data()
            for item in self.data['photos']['results']:
                name = item['id']
                url = item['urls'][self.quality]
                print(url)
                self.download(url, name)

    def Rename(self):
        files = os.listdir("imgs")
        for i in range(len(files)):
            file = files[i]
            temp_name = f'img_{i}.jpg'
            os.rename(os.path.join("imgs", file),
                      os.path.join("imgs", temp_name))


if __name__ == "__main__":
    scraper = Unsplash("cars")
    scraper.Scraper(10)
    scraper.Rename()
