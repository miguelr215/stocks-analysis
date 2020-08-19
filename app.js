// STOCKS & OPTIONS
'use strict';

// stocks api
const apiKeyStocks = 'JKU1DI2LG0JQH6O2';

//
//  HOME PAGE
//

// function to format numbers with commas and currency
function formatNumber(num) {
    if(num){
      return '$' + num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');  
    } else {
        return '-';
    };
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

    let startScroll = document.getElementById('quoteContainer');
    startScroll.scrollIntoView();
};

// function to create params string
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
};

// function to getCompany
function getQuote(symbol){
    const params = {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: apiKeyStocks
    };
    // let searchURL = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=';
    let searchURL = 'https://www.alphavantage.co/';
    const queryString = formatQueryParams(params);
    const url = searchURL + 'query?' + queryString;

    fetch(url)
        .then(response => {
            // if(response.status === 200){
            if(response.ok){
                return response;
            } else {
                throw 'Error with response (in getQuote function)';
            }
        })
        .then(response => response.json())
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
    
    $('#company').val(companyName);
    
    headerString = `Results:
        <h3>Company: ${companyName}</h3>
        <h3>Symbol: ${companySymbol}</h3>`;
    
    finalCompString = `
        <div class="companyInfo"><p><b><u>Sector:</u></b> ${companySector}</p>
        <p><b><u>Description:</u></b> ${companyDescription}</p></div>
            <table class="stockTable">
                <tr>
                    <td></td>
                    <td><b>${companyName} Stock Information</b></td>
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
    const params = {
        function: 'OVERVIEW',
        symbol: symbol,
        apikey: apiKeyStocks
    };
    // let searchURL = 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=';
    let searchURL = 'https://www.alphavantage.co/';
    const queryString = formatQueryParams(params);
    const url = searchURL + 'query?' + queryString;

    fetch(url)
        .then(response => {
            if(response.ok){
                return response;
            } else {
                throw 'Error with response (in getQuote function)';
            }
        })
        .then(response => response.json())
        .then(responseJson => displayCompany(responseJson))
        .catch(error => alert(`Error Message3: ${error.message}`));
};

// function to displayNews
function displayNews(responseJson){
    $('#newsList').empty();
    for(let i = 0; i < responseJson.value.length || i === 24; i++){
        let title = responseJson.value[i].title;
        let url = responseJson.value[i].url;
        let newsImage = '';

        if(responseJson.value[i].image.thumbnail){
            newsImage = responseJson.value[i].image.thumbnail;
        } else {
            newsImage = 'temp-placeholder.png';
        };
        
        $('#newsList').append(
            '<li class="newsItem"><img src="'+ newsImage +'" alt="placeholder" width="200px"><a href="'+ url +'" target="_blank"><h3>'+ title +'</h3></a></li>');
    };
    $('.newsBox').removeClass('hidden');
};

// function to getNews
function getNews(company){
    const params = {
        autoCorrect: false,
        pageNumber: 1,
        pageSize: 25,
        safeSearch: false,
        q: company
    };
    // let hostURL = 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/NewsSearchAPI?autoCorrect=false&pageNumber=1&pageSize=25&q=';
    const searchURL = 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/';
    const queryString = formatQueryParams(params);
    let myHeaders = new Headers();
    myHeaders.append("x-rapidapi-host", "contextualwebsearch-websearch-v1.p.rapidapi.com");
    myHeaders.append("x-rapidapi-key", "e7a6c4e25amsh6520ffbc8ffad26p10cd43jsnc4253ca2ded9");

    let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    const url = searchURL + 'NewsSearchAPI?' + queryString;

    fetch(url, requestOptions)
        .then(response => {
            if(response.ok){
                return response;
            } else {
                throw 'Error with response (in getQuote function)';
            }
        })
        .then(response => response.json())
        .then(responseJson => displayNews(responseJson))
        .catch(error => alert(`Error Message4: ${error.message}`));
};

// function to listen for which matching company was selected
function selectedCompany(){
    $('.autocompleteList').on('click', '.companyMatchLI', function(event){
        event.preventDefault();
        let selectedCompany = $(this).closest('li').data('value');
        getCompany(selectedCompany);
        getQuote(selectedCompany);
        
        $('.autocompleteList').empty();
        $('#autocompleteHeader').addClass('hidden');
        $('#autocompleteDiv').addClass('hidden');
        $('#autocompleteHeader').removeClass('auto-bg-color');
        $('#autocompleteDiv').removeClass('auto-bg-color');
    });
};

// function to display matching companies
function displayMatchingCompanies(responseJson){
    $('#autocompleteHeader').empty();
    $('.autocompleteList').empty();
    $('#autocompleteHeader').removeClass('hidden');
    $('#autocompleteDiv').removeClass('hidden');
    $('#autocompleteHeader').addClass('auto-bg-color');
    $('#autocompleteDiv').addClass('auto-bg-color');
    $(' #autocompleteHeader').html('Select a Company:');
    
    for(let i = 0; i < responseJson.bestMatches.length; i++){
        $('.autocompleteList').append(`
        <li class="companyMatchLI" data-value="${responseJson.bestMatches[i]['1. symbol']}"><a href="#">${responseJson.bestMatches[i]['2. name']} (${responseJson.bestMatches[i]['1. symbol']})</a></li>`);
    };
};

// function to search companies from user input data
function searchCompanies(company){
    const params = {
        function: 'SYMBOL_SEARCH',
        keywords: company,
        apikey: apiKeyStocks
    };
    // let searchURL = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=';
    const searchURL = 'https://www.alphavantage.co/';
    const queryString = formatQueryParams(params);
    const url = searchURL + 'query?' + queryString;

    fetch(url)
        .then(response => {
            if(response.ok){
                return response;
            } else {
                throw 'Error with response (in getQuote function)';
            }
        })
        .then(response => response.json())
        .then(responseJson => displayMatchingCompanies(responseJson))
        .catch(error => alert(`Error Message1: ${error.message}`));
};

// function to watchForm 
function watchForm(){
    $('form').on('click', '.js-submitBtn', function(event){
        event.preventDefault();
        let company = $('#company').val();
        if(company && company.length > 0 && company.trim().length > 0){
            $('.js-errorMsg').empty();
            searchCompanies(company);
        } else {
            $('.js-errorMsg').html('Please enter a company or symbol to research');
        };
                
    });
};

//
//  INVESTING EDUCATION PAGE
//

// function to displayVideos
function displayVideos(responseJson){
    $('.videoList').empty();
    
    for (let i = 0; i < responseJson.items.length; i++){
        $('.videoList').append(
          `<li class="videoItem"><img src="${responseJson.items[i].snippet.thumbnails.default.url}" width="200px"><a href="www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank"><h3>${responseJson.items[i].snippet.title}</h3></a>
          <p>${responseJson.items[i].snippet.description}</p>
          </li>`
        )};
    $('.videosBox').removeClass('hidden');

    let startScroll = document.getElementById('js-results');
    startScroll.scrollIntoView();
};

// function to getVideos
function getVideos(securityToSearch, educationLevel, maxResults=20){
    const apiKeyYouTube = 'AIzaSyA_r1qBpoPFoPc9IH-nxydP7COTXf1rRzI'; 
    // YouTube api key1 AIzaSyCINHocuz-1yn4g-Bx0xlyQ_gIgBYyBltQ
    // YouTube api key2 AIzaSyA_r1qBpoPFoPc9IH-nxydP7COTXf1rRzI
    const searchYTURL = 'https://www.googleapis.com/youtube/v3/search';
    const params = {
        key: apiKeyYouTube,
        q: 'learn ' + educationLevel + ' ' + securityToSearch,
        part: 'snippet',
        maxResults,
        type: 'video'
      };
      const queryString = formatQueryParams(params);
      const url = searchYTURL + '?' + queryString;
      console.log(url);
    fetch(url)
        .then(response => {
            if(response.ok){
                return response;
            } else {
                throw 'Error with response (in getQuote function)';
            }
        })
        .then(response => response.json())
        .then(responseJson => displayVideos(responseJson))
        .catch(error => alert(`Error Message5: ${error.message}`));
};

// function to watchEduForm
function watchEduForm(){
    $('#eduForm').on('click', '.js-searchBtn', function(event){
        event.preventDefault();
        let securityToSearch = $('#security').val();
        let educationLevel = $('#educationLevel').val();
        getVideos(securityToSearch, educationLevel, 20);
    });
};

// function for navMenu
function navMenu(){
    $('.navIcon').click(function(event){
      if($('.navMenu').hasClass('responsive')){
        $('.navMenu').removeClass('responsive');
      } else {
        $('.navMenu').addClass('responsive');
      }  
    })
}

$(selectedCompany());
$(watchForm());
$(watchEduForm());
$(navMenu());