import urllib3

http = urllib3.PoolManager()

r  = http.request('GET', 'https://rss.stopgame.ru/rss_news.xml', preload_content=False)

with open('rss_news.xml', 'wb') as out:
    while True:
        data = r.read()
        if not data:
            break
        out.write(data)

r.release_conn()