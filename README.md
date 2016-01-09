#Emoji Scraper!

A node.js scraper to fetch data from the [complete emoji list](http://unicode.org/emoji/charts/full-emoji-list.html).

It uses request and cheerio to fetch fields from the table. It also converts the datauri images on the page and downloads them to disk as pngs.

To run, use ``npm install`` to download the node modules from the package.json file. Then use ``node index.js`` to run the script.

The script outputs the data in a data.json file. Emoji pngs are saved in an emojiimg folder.