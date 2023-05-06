import menuArray from './data.mjs'
let orderArr = []

const mainInner = document.getElementById('main__inner')
const orderInner = document.getElementById('order__inner')
const cardForm = document.getElementById('card-form')
const form = document.getElementById('form')
const finaloutput = document.getElementById('final-output__inner')

form.addEventListener('submit', e => {
    e.preventDefault()

    const paymentData = new FormData(form)
    const fullName = paymentData.get('fname')

    cardForm.style.display = 'none'
    orderInner.style.display = 'none'
    finaloutput.textContent = `
        Thanks, ${fullName}! Your order is on its way!
    `
    finaloutput.style.display = 'block'
})

const renderOrderHtml = arr => {
    if(arr.length > 0) {
        let orderItemsStr = ''
        arr.forEach(order => {
            orderItemsStr += `
                <div class="order__item row">
                    <p class="order__item-name">${order.name}</p>
                    <p class="order__item-removal" data-name=${order.name}>remove</p>
                    <p class="order__item-price">$${order.price * order.count}</p>
                </div>
            `
        })
        let total = arr.reduce((acc, curr) => {
            return acc + (curr.price * curr.count)
        }, 0)

        orderInner.innerHTML = `
            <p class="order__title">Your order</p>
            <div class="order__items">
                ${orderItemsStr}
            </div>
            <div class="order__total row">
                <p class="order__item-name">Total price:</p>
                <p class="order__item-price">$${total}</p>
            </div>
            <button class="order__fulfiller" id="order__fulfiller">Complete order</button>
        `

    } else {
        orderInner.innerHTML = ''
    }
}

const createOrder = id => {
    const objWithId = menuArray.find(menu => menu.id === Number(id))

    if(orderArr.some(order => order.name === objWithId.name)) {
        const orderObj = orderArr.find(order => order.name === objWithId.name)
        orderObj['count'] += 1
    } else {
        const orderObj = {name: objWithId.name, price: objWithId.price, count: 1}
        orderArr.push(orderObj)
    }

    renderOrderHtml(orderArr)

}

const handleOrderSubmission = () => {
    cardForm.style.display = 'block'
}

const handleOrderRemoval = name => {
    const index = orderArr.findIndex(order => order.name === name)
    orderArr = [...orderArr.slice(0, index), ...orderArr.slice(index + 1)]
    renderOrderHtml(orderArr)
}

document.addEventListener('click', e => {
    if(e.target.dataset.id) {
        createOrder(e.target.dataset.id)
    }else if(e.target.dataset.name) {
        handleOrderRemoval(e.target.dataset.name)
    }
    else if(e.target.id === 'order__fulfiller') {
        handleOrderSubmission()
    }
})

const getMainHtml = menuArray => {
    let mainHtmlStr = ''
    menuArray.forEach(menu => {
        mainHtmlStr += `
        <div class="item">
            <div class="item__img">${menu.emoji}</div>
            <div class="item__main">
                <h4 class="item__main-title">${menu.name}</h4>
                <p class="item__main-ingredients">${menu.ingredients.join(',')}</p>
                <p class="item__main-price">$${menu.price}</p>
            </div>
            <div class="item__btn" data-id=${menu.id} >+</div>
        </div>
        `
    })
    return mainHtmlStr
}

const renderHtml = htmlStr => {
    mainInner.innerHTML = htmlStr
}

renderHtml(getMainHtml(menuArray))
