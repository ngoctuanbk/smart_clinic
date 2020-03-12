const socket = io();
const nameUrls = new Set(['agencies', 'places', 'users', 'products', 'categories', 'channels'
    , 'areas', 'branches', 'provinces', 'units', 'ranks'
    , 'questions', 'prices', 'orders_agency', 'orders', 'time-keeping', 'inventory_agency'
    , 'customers', 'schedules', 'pushProducts', 'notifications', 'policies']);

const twoActivity = [
    ['provinces', 'districts']
]

socket.on('resetPage', (data = {}) => {
    const { activity } = data;
    const urlpathname = window.location.pathname || '/';
    const page = urlpathname.split('/')[2];
    if (nameUrls.has(activity) && activity === page) {
        window.location.reload();
        return;
    }
    twoActivity.map(activities => {
        if (activities.includes(activity) && activities.includes(page)) {
            window.location.reload();
            return;
        }
    })
})

