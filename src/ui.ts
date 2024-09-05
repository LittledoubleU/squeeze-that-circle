$('input[name="difficulty"]').on('change', function() {
    var selectedValue = $(this).next('label').text();
    $('.difficulty-text').text(selectedValue);
    var difficulty = $(this).val();
});