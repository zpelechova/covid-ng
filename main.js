const Apify = require('apify');

const sourceUrl = 'https://ncovtracker.doh.gov.ph/';
const LATEST = 'LATEST';
let check = false;

Apify.main(async () => {

    // const kvStore = await Apify.openKeyValueStore('COVID-19-BG');
    // const dataset = await Apify.openDataset('COVID-19-BG-HISTORY');
    // const { email } = await Apify.getValue('INPUT');

    console.log('Launching Puppeteer...');
    const browser = await Apify.launchPuppeteer();

    const page = await browser.newPage();
    await Apify.utils.puppeteer.injectJQuery(page);

    console.log('Going to the website...');
    await page.goto(sourceUrl), { waitUntil: 'networkidle0', timeout: 600000 };

    // await page.waitForSelector('#numconf');

    console.log('Getting data...');
    // page.evaluate(pageFunction[, ...args]), pageFunction <function|string> Function to be evaluated in the page context, returns: <Promise<Serializable>> Promise which resolves to the return value of pageFunction
    const result = await page.evaluate(() => {
        const now = new Date();

        // eq() selector selects an element with a specific index number, text() method sets or returns the text content of the selected elements
        const confirmedCases = $('#ember466 > svg > g.responsive-text-label > svg > text').text();
        // const suspectedCases = $("body > main > div:nth-child(4) > table > tbody > tr:nth-child(15) > td:nth-child(3) > strong").text();
        // const deaths = $('body > main > div:nth-child(4) > table > tbody > tr:nth-child(15) > td:nth-child(4) > strong').text();
        // const testedTotal = $("body > main > div:nth-child(5) > table > tbody > tr > td:nth-child(1)").text();
        // const testedPozitive = $("body > main > div:nth-child(5) > table > tbody > tr > td:nth-child(2)").text();
        // const testedNegative = $("body > main > div:nth-child(5) > table > tbody > tr > td:nth-child(3)").text();


        // const regionsTableRows = Array.from(document.querySelectorAll("table tbody tr"));
        // const regionData = [];

        // for(const row of regionsTableRows){
        //     const cells = Array.from(row.querySelectorAll("td")).map(td=> td.textContent);
        //     regionData.push({region: cells[0], total: cells[1], lastDay: cells[2], inc14d: cells[3]});
        // }

        const data = {
            confirmedCases: confirmedCases,
            // suspectedCases: suspectedCases,
            // deaths: deaths,
            // testedTotal: testedTotal,
            // testedPozitive: testedPozitive,
            // testedNegative: testedNegative,
            sourceUrl: 'https://www.canada.ca/en/public-health/services/diseases/2019-novel-coronavirus-infection.html',
            lastUpdatedAtApify: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes())).toISOString(),
            readMe: 'https://github.com/zpelechova/covid-bg/blob/master/README.md',
        };
        return data;

    });

    console.log(result)

    // if (!result.infected || !result.deceased || !result.recovered) {
    //     check = true;
    // }
    // else {
    //     let latest = await kvStore.getValue(LATEST);
    //     if (!latest) {
    //         await kvStore.setValue('LATEST', result);
    //         latest = result;
    //     }
    //     delete latest.lastUpdatedAtApify;
    //     const actual = Object.assign({}, result);
    //     delete actual.lastUpdatedAtApify;

    //     if (JSON.stringify(latest) !== JSON.stringify(actual)) {
    //         await dataset.pushData(result);
    //     }

    //     await kvStore.setValue('LATEST', result);
    //     await Apify.pushData(result);
    // }


    // console.log('Closing Puppeteer...');
    // await browser.close();
    // console.log('Done.');

    // // if there are no data for TotalInfected, send email, because that means something is wrong
    // const env = await Apify.getEnv();
    // if (check) {
    //     await Apify.call(
    //         'apify/send-mail',
    //         {
    //             to: email,
    //             subject: `Covid-19 BG from ${env.startedAt} failed `,
    //             html: `Hi, ${'<br/>'}
    //                     <a href="https://my.apify.com/actors/${env.actorId}#/runs/${env.actorRunId}">this</a> 
    //                     run had 0 TotalInfected, check it out.`,
    //         },
    //         { waitSecs: 0 },
    //     );
    // };
});
