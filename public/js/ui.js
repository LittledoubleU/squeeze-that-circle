var difficulty; // declare globally

$('input[name="difficulty"]').on('change', function() {
    var selectedValue = $(this).next('label').text();
    $('.difficulty-text').text(selectedValue);
    
    difficulty = $(this).val(); // This now updates the global difficulty
    handleDifficultyChange(difficulty); // pass the updated value to the handler
});
