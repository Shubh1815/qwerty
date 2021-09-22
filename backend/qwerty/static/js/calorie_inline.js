const toggleCalorieFormset = (category, formsets, max_formsets) => {
    if (category === 'canteen') {
        if (formsets < max_formsets) {
            formsets += 1;
            django.jQuery('.add-row > a').trigger('click');
        }
    } else {
        if (formsets) {
            formsets -= 1;
            django.jQuery('.inline-deletelink').trigger('click');
        }
    }

    if (!formsets) {
        django.jQuery('#calorie-group').hide();
    } else {
        django.jQuery('#calorie-group').show();
    }

    return formsets;
}


window.addEventListener("DOMContentLoaded", () => {
    (function ($) {
        let category = $('#id_category').val();
        let max_formsets = 1;
        let formsets = 1;

        $('#id_category').on('change', () => {
            category = $('#id_category').val();
            formsets = toggleCalorieFormset(category, formsets, max_formsets);
        });
    }(django.jQuery));
});
