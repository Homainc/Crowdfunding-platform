export default {
    required: value => !!value || 'Required',
    min6: value => value.length >= 6 || 'Must contains at least 6 symbols',
    email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    },
};

export const isFormValid = function(refs, form){
    Object.keys(form).forEach(k => { refs[k].validate(true); });
    let formHasErrors = false; 
    for (let i in refs.form.errorBag){
        formHasErrors = formHasErrors || refs.form.errorBag[i];
    }
    return !formHasErrors;
}