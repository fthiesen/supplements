$(document).ready(function(){

    let supplements = [];

    // form submission
    $('form').on("submit", function(event){

        event.preventDefault();

        // adding supplements

        // get variables
        const brand = $('#brand').val();
        const price = Number($('#price').val());
        const volume = Number($('#volume').val());
        const serving = Number($('#serving').val());
        const amount = Number($('#amount').val());
        const calc = price / ( volume / serving * amount );

        if ( brand && price && volume && serving && amount ) {

            // update array
            const suppIndex = supplements.push({
                brand: brand,
                price: price,
                volume: volume,
                serving: serving,
                amount: amount,
                calc: calc
            }) - 1;

            // display added supplement
            $('.supplements').append(`
            
                <div class="supplement" setid="${suppIndex}">
                <p>Brand: <strong>${brand}</strong><br>
                Price: $${price}<br>
                Volume: ${volume} ml<br>
                Serving Size: ${serving} ml<br>
                Amount per Serving: ${amount} mg<br>
                <button id="remove" class="icon" setid="${suppIndex}" aria-label="Remove supplement ${brand}" title="Remove supplement ${brand}"><span class="lnr lnr-trash" aria-hidden="true"></span></button></p>
                </div>
            
            `)

            // empty form fields
            $('input[type=text]').val('');

            // add Calculate button?
            calcButton();

        } else {

            openPopup(`<span class="lnr lnr-warning"  aria-hidden="true"></span>`,`Error`,`Please fill in all fields to add a supplement and make sure all fields except Brand are valid numbers.`);

        }

    }) // end of listening to form submission

    // remove supplement from array and page
    $('.supplements').on("click", "#remove", function(){
        const id = $(this).attr('setid');
        // remove from array
        supplements[id] = null;
        // remove from page
        $(`.supplement[setid=${id}]`).remove();
        // remove Calculate button?
        calcButton();
    });

    // start calc
    $('.buttons').on("click", "#calcButton", function(){

        // put all calcs into a new array
        // if they have been removed add a large number
        const compareArray = supplements.map(function(supp){
            if (supp != null) {
                return supp.calc;
            } else {
                return Infinity;
            }
        })
                
        // check to see which one is cheaper
        const cheaper = Math.min(...compareArray);

        // find index of the cheaper supplement
        function isCheaper(supp) {
            return supp == cheaper;
        }
        const index = compareArray.findIndex(isCheaper);

        // show results
        openPopup(`Results`, `<span class="lnr lnr-star"  aria-hidden="true"></span> ${supplements[index].brand}<p>offers the best value for your money!</p>`, `$${supplements[index].calc.toFixed(4)} (price per mg)`);

        // block tabbing through page while popup is open
        $('.container input, .container button').attr('tabindex', '-1');

    }) // end listening to calculate button click

    // try again button
    $('.buttons').on("click", "#resetButton", function(){
        $('.supplements').empty();
        $('.buttons').empty();
        $('.reset').empty();
        supplements = [];

    }) // end of try again

    // add or remove Calculate and Reset buttons based on real array length
    let lengthArray;
    function calcButton() {

        // set lenghtArray
        lengthArray = supplements.filter(function(supp){
            return supp != null;
        });

        // add or remove buttons Calculate and Reset
        if ( lengthArray.length < 2 ) {
            $('.buttons').empty();
        } else {
            $('.buttons').html(`
                <button id="calcButton">Calculate!</button>
                <button id="resetButton">Restart!</button> or add more supplements.
            `);
        }

    }; // end calcButton()

    function openPopup(title, subtitle, message) {

        // clear popup content
        $('#popup').empty();
        // show popup and overlay
        $('#overlay').toggleClass('hidden');
        $('#popup').toggleClass('hidden');

        $('#popup').append(`

            <button id="close" class="icon" aria-label="Close results popup" title="Close">
                <span class="lnr lnr-cross" aria-hidden="true"></span>
            </button>

            <h2>${title}</h2>
            <h3>${subtitle}</h3>
            <p>${message}</p>

        `);
    
    }; // end openPopup()
    
    // close popup
    $('#popup').on("click", "#close", function(){
        $('#overlay').toggleClass('hidden');
        $('#popup').toggleClass('hidden');
        $('.container input, .container button').attr('tabindex', '0');
    });

}) // end of document ready