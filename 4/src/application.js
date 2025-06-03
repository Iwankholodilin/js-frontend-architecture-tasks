// BEGIN
export default (companies) => {
    const container = document.querySelector('.container');
    const state = {
        companiesList: companies,
        uiState: {
            activeCompanyId: null,
        },
        valueDescription: null,
    };

    const render = (state) => {
        const existingDescription = container.querySelector('div');
        if (existingDescription) {
            container.removeChild(existingDescription);
        }
        if (state.valueDescription) {
            const descriptionDiv = document.createElement('div');
            descriptionDiv.textContent = state.valueDescription;
            container.appendChild(descriptionDiv);
        }
    };
    const createButton = (state) => {
        state.companiesList.forEach(company => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-primary');
            button.textContent = company.name;
            container.appendChild(button);
            button.addEventListener('click', () => {
                const { activeCompanyId } = state.uiState;
                if (activeCompanyId === company.id) {
                    state.uiState.activeCompanyId = null;
                    state.valueDescription = null;
                } else {
                    state.uiState.activeCompanyId = company.id;
                    state.valueDescription = company.description;
                }
                render(state);
            });
        });
    };
    createButton(state);
}
// END
