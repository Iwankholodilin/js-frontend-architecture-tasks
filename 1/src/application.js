// BEGIN
export default () => {
    const form = document.querySelector('form');
    const input = form.querySelector('.form-control');
    const resultDiv = document.getElementById('result');
    const resetButton = document.querySelector('.btn-outline-primary');
    let sum = 0;
    input.focus();
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const inputValue = parseInt(input.value, 10);
        sum += inputValue;
        resultDiv.textContent = sum;
        form.reset(); 
        input.focus();
    });
    resetButton.addEventListener('click', () => {
        sum = 0;
        resultDiv.textContent = sum;
        form.reset(); 
        input.focus();
    });
}
// END
