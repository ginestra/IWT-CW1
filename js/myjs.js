$(document).ready(function() {

    $('#trigger-results').click(function() {
        var results = $('#result-list');
        results.text('Loading results...');

        // Smooth scroll to results when hitting the 'Search' button
        $('html, body').animate({scrollTop: $("#results").offset().top}, 500);

        $.ajax({
            type: 'GET',
            url: 'nobel.json',
            dataType: 'json',

            success: function(data) {          
                
                // Initialising the table
                $('#result-list').html('<thead><tr><th>Category</th>' +
                                       '<th>Year</th><th>ID</th><th>Firstname</th>' +
                                       '<th>Surname</th><th>Share</th>' +
                                       '</tr></thead><tbody>');

                // Setting up for building the query string with JSPath library
                var path = '.prizes';
                var subpath = '..laureates';

                // Counting the results
                var count = 0;

                // If one or more input fields are not empty,
                // build the query string to retrieve the relevant data.

                // 1)
                if (!isEmpty($('#category').val())) {
                    // Getting user input, converting it to lower case to
                    // match lower and upper case
                    var userCategory = $('#category').val().toLowerCase();
                    path += '{.category === "' + userCategory + '"}'; 
                }

                // 2)
                if (!isEmpty($('#year').val())) {
                    // Getting user input.
                    // Won't check for range nor type, since already doing it
                    // in the html form
                    var userYear = $('#year').val();

                    var userYearOperator = $('select#year-range option:selected').val();

                    // Defaulting to === if none selected.
                    if (userYearOperator == "") {
                        userYearOperator = "===";
                    }

                    // Checking that the value of the year is within the range
                    // of the data, if not, suggesting the use of < > operators.
                    if (userYearOperator === "===" && (userYear < 1901 || userYear > 2017)) {
                        $('#year-error').html('Year range is 1901 to 2017.<br>' +
                            'Please enter a different year or consider using ' +
                            '> < operators.');
                    } else {
                        $('#year-error').empty();
                    }

                    path += '{.year ' + userYearOperator + ' "' + userYear + '"}';
                }

                // 3)
                if (!isEmpty($('#share').val())) {
                    // Getting user input.
                    // Won't check for range nor type, since already doing it
                    // in the html form
                    var userShare = $('#share').val();
                    console.log('userShare: ' + userShare);

                    var userShareOperator = $('select#share-range option:selected').val();

                    // Defaulting to === if none selected.
                    if (userShareOperator == "") {
                        userShareOperator = "===";
                    }

                    // Checking that the value of share is within the range
                    // of the data, if not, suggesting the use of < > operators.
                    if (userShareOperator === "===" && (userShare < 1 || userShare > 4)) {
                        $('#share-error').html('Share range is 1 to 4.<br>' +
                            'Please enter a different number or consider using ' +
                            '> < operators.');
                    } else {
                        $('#share-error').empty();
                    }

                    subpath += '{.share ' + userShareOperator + ' "' + userShare + '"}';
                }

                // 4)
                if (!isEmpty($('#surname').val())) {
                    var userSurname = $('#surname').val();

                    // Using *= operator to find partial matches
                    subpath += '{.surname *= "' + userSurname + '"}';
                }
                
                // Finally display the results
                results();
                
                // If no results are found, display the message 'No match found'
                if (count == 0) {
                    $('#warnings').html('<p>No match found</p>');
                } else {
                    $('#warnings').empty();
                }

                // Close the results table
                $('#result-list').append('</tbody>');

                // Display number of results
                $('#count').html('Results: <small><strong>' +
                    count + '</strong> found</small>');

                // 5)
                // This function returns everything if all fields are empty, or
                // passes the path and subpath for JSPath to filter the results.
                function results() {
                    $.each(JSPath.apply(path, data), function(i, prize) {
                        $.each(JSPath.apply(subpath, prize), function(j, laureate) {
                            $('#result-list').append('<tr><td>' +
                               prize.category + '</td><td>' +
                               prize.year + '</td><td>' +

                               laureate.id + '</td><td>' +
                               laureate.firstname + '</td><td>' +
                               laureate.surname + '</td><td>' +
                               laureate.share + '</td></tr>'
                            );

                            // Counting table rows to find out how many results
                            count++;
                        });
                    });
                }
            }
        });
    });

    // Basic function to check for empty value in fields
    function isEmpty(obj) {
        if (obj == '') {
            return true;
        }

        return false;
    }
});

