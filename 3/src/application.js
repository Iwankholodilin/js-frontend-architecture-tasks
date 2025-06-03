// BEGIN
export default (catalog) => {
  const filterForm = document.querySelector('form');
  const processorSelectElement = filterForm.querySelector('select[name="processor_eq"]');
  const memorySelectElement = filterForm.querySelector('select[name="memory_eq"]');
  const minFrequencyInput = filterForm.querySelector('input[name="frequency_gte"]');
  const maxFrequencyInput = filterForm.querySelector('input[name="frequency_lte"]');
  const resultsContainer = document.querySelector('.result');
  const filterState = {
    selectedProcessor: "",
    selectedMemory: "",
    minFrequency: "",
    maxFrequency: "",
  }
  const applyFilters = () => {
    const filteredCatalog = catalog.filter(item => {
      return Object.keys(filterState).every(key => {
        if (!filterState[key]) {
          return true;
        }
        const filterValue = filterState[key];
        if (key === 'selectedProcessor') {
          return item.processor === filterValue;
        } else if (key === 'selectedMemory') {
          return String(item.memory) === filterValue;
        } else if (key === 'minFrequency') {
          return item.frequency >= Number(filterValue);
        } else if (key === 'maxFrequency') {
          return item.frequency <= Number(filterValue);
        } else {
          return true;
        }
      });
    });
    return filteredCatalog;
  };
  const updateResultsView = () => {
    const filteredItems = applyFilters();
    if (filteredItems.length === 0) {
      resultsContainer.innerHTML = '';
      return;
    }
    const listElement = document.createElement('ul');
    listElement.classList.add('list-group');
    filteredItems.forEach(item => {
      const listItemElement = document.createElement('li');
      listItemElement.classList.add('list-group-item');
      listItemElement.textContent = item.model;
      listElement.appendChild(listItemElement);
    });
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(listElement);
  };
  const updateFilters = () => {
    filterState.selectedProcessor = processorSelectElement.value;
    filterState.selectedMemory = memorySelectElement.value;
    filterState.minFrequency = minFrequencyInput.value;
    filterState.maxFrequency = maxFrequencyInput.value;
  };
  const handleFormChange = () => {
    updateFilters();
    updateResultsView();
  };
  filterForm.addEventListener('input', handleFormChange);
  filterForm.addEventListener('change', handleFormChange);
  updateResultsView();
}
// END
