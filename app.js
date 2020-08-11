// STOCKS & OPTIONS
'use strict';

// stocks api
const apiKeyStocks = 'JKU1DI2LG0JQH6O2';

//
//  HOME PAGE
//

// function to format numbers with commas and currency
function formatNumber(num) {
    return '$' + num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

// function to determinePriceColor
function determinePriceColor(priceChange){
    let stockPrice = Number(priceChange);
    if(stockPrice >= 0){
        return 'green';
    } else {
        return 'red';
    }
};

// function to determinePriceColor
function determinePrevPriceColor(previousPrice, price){
    let prevPrice = Number(previousPrice);
    let currentPrice = Number(price);
    if(prevPrice >= currentPrice){
        return 'green';
    } else {
        return 'red';
    }
};

// function to displayResults
function displayQuote(responseJson){
    $('.quoteBox').empty();
    let price = responseJson['Global Quote']['05. price'];
    let previousPrice = responseJson['Global Quote']['08. previous close'];
    let lastTradingDay = responseJson['Global Quote']['07. latest trading day'];
    let priceChange = responseJson['Global Quote']['09. change'];
    let priceChangePercent = responseJson['Global Quote']['10. change percent'];

    let finalString = `
    <div class="priceItems">
    <h3 class="`+ determinePriceColor(priceChange) +`">Current Price:  $`+price+`</h3>
    <h5 class="`+ determinePrevPriceColor(previousPrice, price) +`">Previous Price:  $`+previousPrice+` on `+ lastTradingDay +`</h5>
    <h5 class="`+ determinePriceColor(priceChange) +`">Price Change ($):  `+ priceChange +`  (`+ priceChangePercent +` change)</h5>
    </div>
    `;
    $('.quoteBox').html(finalString);
    $('.quoteBox').removeClass('hidden');
};

// function to getCompany
function getQuote(symbol){
    let hostURL = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=';
    // 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=' + apiKey;
    let url = '';
    url = hostURL + symbol + '&apikey=' + apiKeyStocks;

    fetch(url)
        .then(response => response.json())
        // .then(response => {
        //     console.log(response);
        //     if(response.status == 'ok'){
        //         return response;
        //     } else {
        //         throw 'Error with response (in getQuote function)';
        //     }
        // })
        .then(responseJson => displayQuote(responseJson))
        .catch(error => alert(`Error Message2: ${error.message}`));
};

// function to getFinancialResults
function displayCompany(responseJson){
    $('.resultsBox').empty();
    let headerString = '';
    let finalCompString = '';
    let companyName = responseJson.Name;
    let companySymbol = responseJson.Symbol;
    let companyDescription = responseJson.Description;
    let companySector = responseJson.Sector;
    let companyMktCap = formatNumber(responseJson.MarketCapitalization);
    let companyPE = responseJson.PERatio;
    let companyForwardPE = responseJson.ForwardPE;
    let companyDividendYield = responseJson.DividendYield;
    let companyDividendPerShr = responseJson.DividendPerShare;
    let companyEPS = responseJson.EPS;
    let companyBeta = responseJson.Beta;
    let company52High = responseJson['52WeekHigh'];
    let company52Low = responseJson['52WeekLow'];
    let company50DMA = responseJson['50DayMovingAverage'];
    let company200DMA = responseJson['200DayMovingAverage'];
    let companyTargetPrice = responseJson.AnalystTargetPrice;
    
    // fill input box with selected company name
    $('#company').val(companyName);
    // return headerString
    headerString = `Company News for:
        <h3>Company: ${companyName}</h3>
        <h3>Symbol: ${companySymbol}</h3>`;
    // return full string
    finalCompString = `
        <p><b>Sector:</b> ${companySector}</p>
        <p><b>Description:</b> ${companyDescription}</p>
            <table class="stockTable">
                <tr>
                    <td></td>
                    <td><b>Stock Information</b></td>
                    <td></td>
                </tr>
                <tr>
                    <td><b>Market Cap:</b>  ${companyMktCap}</td>
                    <td><b>PE Ratio:</b>  ${companyPE}</td>
                    <td><b>EPS ($):</b>  ${companyEPS}</td>
                </tr>
                <tr>
                    <td><b>52-week high:</b>  $${company52High}</td>
                    <td><b>Forward PE Ratio:</b>  ${companyForwardPE}</td>
                    <td><b>50-Day Moving Avg:</b>  $${company50DMA}</td>
                </tr>
                <tr>
                    <td><b>52-week low:</b>  $${company52Low}</td>
                    <td><b>Dividend Yield:</b>  ${companyDividendYield}%</td>
                    <td><b>200-Day Moving Avg:</b>  $${company200DMA}</td>
                </tr>
                <tr>
                    <td><b>Beta:</b>  ${companyBeta}</td>
                    <td><b>Dividend Per Share ($):</b>  ${companyDividendPerShr}</td>
                    <td><b>Analysts Target Price:</b>  $${companyTargetPrice}</td>
                </tr>
            </table>
    `;

    $('.resultsHeader').html(headerString);
    $('.resultsBox').html(finalCompString);
    $('.resultsBox').removeClass('hidden');
    $('.resultsHeader').removeClass('hidden');
    getNews(companyName);
};

// function to getFinancials
function getCompany(symbol){
    let hostURL = 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=';
    let url = '';
    url = hostURL + symbol +'&apikey=' + apiKeyStocks;

    // fetch(url)
    //     .then(response => response.json())
    //     .then(response => {
    //         console.log(response);
    //         if(response.status == 'ok'){
    //             return response;
    //         } else {
    //             throw 'Error with response (in getQuote function)';
    //         }
    //     })
    //     .then(responseJson => displayQuote(responseJson))
    //     .catch(error => alert(`Error Message2: ${error.message}`));
    fetch(url)
        .then(response => response.json())
        .then(responseJson => displayCompany(responseJson))
        .catch(error => alert(`Error Message3: ${error.message}`));
};

// function to displayNews
function displayNews(responseJson){
    console.log(responseJson.totalCount);
    $('#newsList').empty();
    for(let i = 0; i < responseJson.value.length || i === 24; i++){
        let title = responseJson.value[i].title;
        let url = responseJson.value[i].url;
        let description = responseJson.value[i].description;
        let newsImage = '';
        if(responseJson.value[i].image.thumbnail){
            newsImage = responseJson.value[i].image.thumbnail;
        } else {
            newsImage = 'temp-placeholder.png';
        };
        console.log(newsImage);
        $('#newsList').append(
            '<li class="newsItem"><img src="'+ newsImage +'" alt="placeholder" width="200px"><a href="'+ url +'" target="_blank"><h3>'+ title +'</h3></a><p>'+ description +'</p></li>');
    };


    $('.newsBox').removeClass('hidden');
};

// function to getNews
function getNews(company){
    console.log(company);
    let hostURL = 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI?autoCorrect=false&pageNumber=1&pageSize=25&q=';
    // https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI?autoCorrect=false&pageNumber=1&pageSize=25&q=ibm&safeSearch=false
    let url = '';
    let myHeaders = new Headers();
    myHeaders.append("x-rapidapi-host", "contextualwebsearch-websearch-v1.p.rapidapi.com");
    myHeaders.append("x-rapidapi-key", "e7a6c4e25amsh6520ffbc8ffad26p10cd43jsnc4253ca2ded9");

    let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    url = hostURL + company + '&safeSearch=false';

    // fetch(url)
    //     .then(response => response.json())
    //     .then(response => {
    //         console.log(response);
    //         if(response.status == 'ok'){
    //             return response;
    //         } else {
    //             throw 'Error with response (in getQuote function)';
    //         }
    //     })
    //     .then(responseJson => displayQuote(responseJson))
    //     .catch(error => alert(`Error Message2: ${error.message}`));
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(responseJson => displayNews(responseJson));
    //   .catch(error => console.log('error', error));
};

// function to listen for which matching company was selected
function selectedCompany(){
    $('.autocompleteList').on('click', '.companyMatchLI', function(event){
        event.preventDefault();
        let selectedCompany = $(this).closest('li').data('value');
        getCompany(selectedCompany);
        getQuote(selectedCompany);
        // clear autocompleteList
        $('.autocompleteList').empty();
        // hide header and autocompleteDiv
        $('#autocompleteHeader').addClass('hidden');
        $('#autocompleteDiv').addClass('hidden');
        $('#autocompleteHeader').removeClass('auto-bg-color');
        $('#autocompleteDiv').removeClass('auto-bg-color');
    });
};

// function to display matching companies
function displayMatchingCompanies(responseJson){
    console.log('displayMatchingCompanies running');
    // clear previous results
    $('#autocompleteHeader').empty();
    $('.autocompleteList').empty();
    // unhide header and autocompleteDiv
    $('#autocompleteHeader').removeClass('hidden');
    $('#autocompleteDiv').removeClass('hidden');
    $('#autocompleteHeader').addClass('auto-bg-color');
    $('#autocompleteDiv').addClass('auto-bg-color');
    // insert autocompleteHeader string
    $(' #autocompleteHeader').html('Select a Company:');
    // loop through response and create html string
    for(let i = 0; i < responseJson.bestMatches.length; i++){
        $('.autocompleteList').append(`
        <li class="companyMatchLI" data-value="${responseJson.bestMatches[i]['1. symbol']}"><a href="#">${responseJson.bestMatches[i]['2. name']} (${responseJson.bestMatches[i]['1. symbol']})</a></li>`);
    };
};

// function to search companies from user input data
function searchCompanies(company){
    console.log('searchCompanies running');
    let url = '';
    let hostURL = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=';
    url = hostURL + company + '&apikey=' + apiKeyStocks;

    fetch(url)
        .then(response => response.json())
        // .then(response => {
        //     console.log(response);
        //     if(response.status == 'ok'){
        //         return response;
        //     } else {
        //         throw 'Error with response (in Search Companies function)'
        //     }
        // })
        .then(responseJson => displayMatchingCompanies(responseJson))
        .catch(error => alert(`Error Message1: ${error.message}`));
};

// function to watchForm 
function watchForm(){
    console.log('app running...');
    $('form').on('click', '.js-submitBtn', function(event){
        event.preventDefault();
        let company = $('#company').val();
        console.log(company);
        searchCompanies(company);        
    });
};

//
//  INVESTING EDUCATION PAGE
//

// function to displayVideos
function displayVideos(responseJson){
    $('.videoList').empty();
    console.log(responseJson);
    for (let i = 0; i < responseJson.items.length; i++){
        $('.videoList').append(
          `<li class="videoItem"><img src="${responseJson.items[i].snippet.thumbnails.default.url}" width="200px"><a href="www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank"><h3>${responseJson.items[i].snippet.title}</h3></a>
          <p>${responseJson.items[i].snippet.description}</p>
          </li>`
        )};
    $('.videosBox').removeClass('hidden');
};

// function to create params string
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
};

// function to getVideos
function getVideos(securityToSearch, educationLevel, maxResults=20){
    const apiKeyYouTube = 'AIzaSyCINHocuz-1yn4g-Bx0xlyQ_gIgBYyBltQ'; 
    const searchYTURL = 'https://www.googleapis.com/youtube/v3/search';
    const params = {
        key: apiKeyYouTube,
        q: 'learn ' + educationLevel + ' ' + securityToSearch,
        part: 'snippet',
        maxResults,
        type: 'video'
      };
      const queryString = formatQueryParams(params)
      const url = searchYTURL + '?' + queryString;

    //   fetch(url)
    //     .then(response => response.json())
    //     .then(response => {
    //         console.log(response);
    //         if(response.status == 'ok'){
    //             return response;
    //         } else {
    //             throw 'Error with response (in getQuote function)';
    //         }
    //     })
    //     .then(responseJson => displayQuote(responseJson))
    //     .catch(error => alert(`Error Message2: ${error.message}`));
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(responseJson => displayVideos(responseJson));
    //   .catch(error => alert('error getting videos'));
};

// function to watchEduForm
function watchEduForm(){
    console.log('edu app running...');
    $('#eduForm').on('click', '.js-searchBtn', function(event){
        event.preventDefault();
        let securityToSearch = $('#security').val();
        let educationLevel = $('#educationLevel').val();
        console.log(securityToSearch);
        console.log(educationLevel);
        getVideos(securityToSearch, educationLevel, 20);
    });
};

$(selectedCompany());
$(watchForm());
$(watchEduForm());