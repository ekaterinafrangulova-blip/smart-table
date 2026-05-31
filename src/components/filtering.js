export function initFiltering(elements) {
    // заполнение выпадающих списков опциями (вызывается после получения индексов с сервера)
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map(name => {
                    const option = document.createElement('option');
                    option.textContent = name;
                    option.value = name;
                    return option;
                })
            );
        });
    };

    // формирование параметров фильтрации для запроса
    const applyFiltering = (query, state, action) => {
        // обработка очистки поля фильтра
        if (action && action.name === 'clear') {
            const input = action.parentElement.querySelector('input');
            if (input) input.value = '';
        }

        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) {
                    filter[`filter[${elements[key].name}]`] = elements[key].value;
                }
            }
        });

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}
