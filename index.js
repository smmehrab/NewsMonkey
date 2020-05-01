const puppeteer = require('puppeteer');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const fs = require('fs');

async function configureHeadlessBrowser() {
    const url = 'https://hckrnews.com/';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
        }

        const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
    };
}

async function readNews(page) {
    await page.reload();
    var scraper = await page.evaluate(() => {
        let allNewsElements = document.querySelectorAll('.entry.row');
        let boundary = document.querySelector('.row.day');

        let todaysNewsElementsHTML = [];
        let todaysNews = [];

        for (let i = 0; i < allNewsElements.length; i++) {
            newsElement = allNewsElements[i];
            let newsElementHTML = newsElement.innerHTML;

            var wrapper = document.createElement('ul');
            wrapper.innerHTML = newsElementHTML;
            let newsPointsComments = wrapper.firstChild.innerText;
            newsPointsComments = newsPointsComments.replace(/(\r\n|\n|\r)/gm, "");
            newsPointsComments = newsPointsComments.replace(/\t/g, " ");
            newsPointsComments = newsPointsComments.split(" ");

            let newsLink = newsElement.querySelector('.link').href;
            let newsTitle = newsElement.querySelector('.link').innerHTML.split(" <span")[0];
            let newsPoints = newsPointsComments[7];
            let newsComments = newsPointsComments[5];

            if (newsPoints != null && newsComments != null) {
                let news = {
                    link: newsLink,
                    title: newsTitle,
                    points: parseInt(newsPoints),
                    comments: parseInt(newsComments)
                };
                todaysNewsElementsHTML.push(newsElementHTML);
                todaysNews.push(news);
            }

            if (newsElement.nextElementSibling == boundary) {
                break;
            }
        }

        return [todaysNewsElementsHTML, todaysNews];
    });

    var newsElementsHTML = scraper[0];
    var news = scraper[1];

    news.sort(compareValues('points', 'desc'));
    console.log(news.length + " news read!");
    return news;
}

async function sendEmail(news, configText) {
    var monkeyEmail = configText[0];
    var monkeyEmailPassword = configText[1];
    var receiverEmail = configText[2];


    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: monkeyEmail,
            pass: monkeyEmailPassword
        }
    });

    let textToSend = "";
    let htmlText = `<ul type="none">`;

    let limit = 5;
    if(limit>news.length){
        limit = news.length;
    }

    for (let i = 0; i < limit; i++) {
        let newsLink = news[i].link;
        let newsTitle = news[i].title;
        let newsPoints = news[i].points;
        let newsComments = news[i].comments;

        htmlText +=
            `
        <li>
        <span style="color:darkorange;  font-size: large; font-weight: bold;">${i + 1}&emsp;</span>
        <a href="${newsLink}" style="text-decoration: none; color:darkorange; font-size: large; font-weight: bold;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
            ${newsTitle}
            <br>
            <span style="font-size: small;font-weight: normal;">&emsp;&emsp;</span>   
            <span style="text-decoration: underline; color:darkgray; font-size: small;font-weight: normal;">(${newsLink})</span>   
            <br>
            <span style="color:darkgray; font-size: small;">&emsp;&emsp;&ensp;points</span>
            <span style="color:darkgray; font-size: small;">${newsPoints}&emsp;</span>
            <span style="color:darkgray; font-size: small;">comments</span>
            <span style="color:darkgray; font-size: small;">${newsComments}</span>
            <hr style="border: 1px solid lightgray;">
        </a>
        </li> 
        `;
    }
    htmlText += `</ul>`

    let info = await transporter.sendMail({
        from: '"News Monkey" ' + monkeyEmail,
        to: receiverEmail,
        subject: 'Today\'s Top 5 Hacker News',
        text: textToSend,
        html: htmlText
    });

    console.log("News Sent: %s", info.messageId);
}

async function activateMonkey() {
    var justActivated = true;

    var configText = fs.readFileSync('./config.txt','utf8');
    configText = configText.split(' ');
    var newsHour = parseInt(configText[3]);
    var newsMinute = parseInt(configText[4]);
    var time = '0 ' + newsMinute + ' ' + newsHour + ' * * *';

    let monkey = new CronJob(time, async () => {
        if (!justActivated) {
            const page = await configureHeadlessBrowser();
            var news = await readNews(page);
            sendEmail(news, configText);
        } else{
            console.log('Monkey Activated!');
            justActivated = false;
        }
    }, null, true, null, null, true);

    monkey.start();
}


// async function fireMonkey(){
//     const page = await configureHeadlessBrowser();
//     var news = await readNews(page);
//     sendEmail(news);
// }

// async function testMonkey(){
//     var justActivated = true;
//     var v = '*/2';
//     let monkey = new CronJob(v + ' * ' + ' * * * *', async () => {
//         if (!justActivated) {
//             const page = await configureHeadlessBrowser();
//             var news = await readNews(page);
//             sendEmail(news);
//         } else{
//             console.log('Monkey Activated!');
//             justActivated = false;
//         }
//     }, null, true, null, null, true);

//     monkey.start();
// }

activateMonkey();
// fireMonkey();
// testMonkey();
