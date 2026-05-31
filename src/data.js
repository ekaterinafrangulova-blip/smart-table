const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData() {
    // переменные для кеширования данных между запросами
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    // приведение строк с сервера к виду, который нужен таблице
    const mapRecords = (records) => records.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers[item.seller_id],
        customer: customers[item.customer_id],
        total: item.total_amount
    }));

    // получение индексов продавцов и покупателей
    const getIndexes = async () => {
        if (!sellers || !customers) {
            [sellers, customers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(response => response.json()),
                fetch(`${BASE_URL}/customers`).then(response => response.json()),
            ]);
        }

        return {sellers, customers};
    };

    // получение записей о продажах с сервера по заданным параметрам
    const getRecords = async (query, isUpdated = false) => {
        const qs = new URLSearchParams(query); // объект параметров → query-часть url
        const nextQuery = qs.toString();

        if (lastQuery === nextQuery && !isUpdated) {
            return lastResult; // параметры не изменились — отдаём сохранённый результат
        }

        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        const records = await response.json();

        lastQuery = nextQuery;
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };

        return lastResult;
    };

    return {
        getIndexes,
        getRecords
    };
}
