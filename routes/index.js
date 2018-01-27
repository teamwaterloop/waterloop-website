const express = require('express');
const mediumGetLatestPosts = require("medium-get-latest-posts")
const router = express.Router();
const teamStructureJSON = require('./teamStructure.json');
const sponsorStructureJSON = require('./sponsorStructure.json');
const sender = require('../api/index');
const flockJSON = require('./flock.json');
const downloadsJSON = require('./downloads.json');

/* GET home page. */
// First gets the latest medium posts
function getBlogPosts() {
    mediumGetLatestPosts.getPublisherLatestPosts('waterloop').then((data) => {
        let blogd = data;
        console.log(blogd);
        router.get('/', (req, res) => {
            console.log(blogd);
            res.render('index', {
                title: 'Waterloop – Canada\'s Hyperloop',
                pageName: 'home',
                pageParams: {
                    blog: blogd,
                },
            });
        });
    });
}

router.get('/flock', (req, res) => {
    res.render('index', {
        title: 'Waterloop – Flock',
        pageName: 'flock',
        pageParams: {
            flock: flockJSON,
        }
    });
});

// The geese (flock pages)
for (const item of flockJSON) {
    router.get('/flock/' + item.url, (req, res) => {
        res.render('index', {
            title: 'Waterloop – ' + item.name,
            pageName: 'goose',
            pageParams: {
              goose: item,
            }
        });
    });
}

router.get('/downloads', (req, res) => {
    res.render('index', {
        title: 'Waterloop – Downloads',
        pageName: 'downloads',
        pageParams: {
            dl: downloadsJSON,
        }
    });
});

let tweetList;
const instaSortedData = {
    video: [],
    image: [],
};

sender.getTweeterPosts(curTweetList => {
    sender.getInstaPosts(instaList => {
        tweetList = curTweetList;
        for (const element of instaList.data) {
            if (element.type === "image" || element.type === "carousel") {
                instaSortedData.image.push(element);
            } else {
                instaSortedData.video.push(element);
            }
        }
    });
});

router.get('/media', (req, res) => {
    res.render('index', {
        title: 'Waterloop – Media',
        pageName: 'media',
        pageParams: {
            tweets: tweetList,
            instas: instaSortedData,
        },
    });
});

router.get('/hyperloop', (req, res) => {
    res.render('index', {
        title: 'Waterloop – Hyperloop',
        pageName: 'hyperloop',
        pageParams: {
          flock: flockJSON,
        }
    });
});

router.get('/team', (req, res) => {
    res.render('index', {
        title: 'Waterloop – Team',
        pageName: 'team',
        pageParams: {
            teamStructure: teamStructureJSON,
        }
    });
});

router.get('/sponsors', (req, res) => {
    res.render('index', {
        title: 'Waterloop – Sponsors',
        pageName: 'sponsors',
        pageParams: {
            sponsors: sponsorStructureJSON.sponsors,
        }
    });
});

router.get('/shop', (req, res) => {
    res.render('index', {
        title: 'Waterloop – Shop',
        pageName: 'shop',
        pageParams: {},
    });
});

router.get('/contact', (req, res) => {
    res.render('index', {
        title: 'Waterloop – Contact',
        pageName: 'contact',
        pageParams: {},
    });
});

router.get('*', (req, res) => {
    res.render('index', {
        title: 'Waterloop – Canada\'s Hyperloop',
        pageName: '404',
        pageParams: {},
    });
});

router.post('/api/submitEmailForm', (req, res) => {
    console.log(`[200] ${req.method} ${req.url}`);

    sender.sendEmail(req.query, result => {
        if (result) {
            res.status(200).json({"message": "Email sent successfully"});
        } else {
            res.status(500).json({"message": "Error when sending email"});
        }
    });

});

router.post('/api/submitSlackForm', (req, res) => {
    console.log(`[200] ${req.method} ${req.url}`);

    sender.sendSlack(req.query, result => {
        if (result) {
            res.status(200).json({"message": "Slack sent successfully"});
        } else {
            res.status(500).json({"message": "Error when sending message"});
        }
    });
});

module.exports = router;
