// STOCKS & OPTIONS
const apiKey = 'JKU1DI2LG0JQH6O2';

// function to displayResults
function displayResults(responseJson){
    let finalString = `<p>Symbol:  ${responseJson['Global Quote']}</p>`
    $('.resultsBox').html(finalString);
    $('.resultsBox').removeClass('hidden');
    $('.resultsHeader').removeClass('hidden');
};

// function to getCompany
function getCompany(company){
    let hostURL = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=';
    
    fetch(hostURL + apiKey)
        .then(response => response.json())
        .then(responseJson => displayResults(responseJson));
        // .catch(error => alert(`Error Message: ${error.message}`));
};

// function to watchForm
function watchForm(){
    console.log('app running...');
    $('form').on('submit', '.js-submitBtn', function(event){
        event.preventDefault();
        let company = $('.company').val();
        getCompany(company);
    });
};

$(watchForm());