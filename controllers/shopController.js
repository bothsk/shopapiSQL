const query = require('../db')

const all_items = async (req,res)=>{
 
    let data 
    try {
        data = await query('SELECT * FROM items')
    } catch {
        res.send('error')
    }

    res.json(data)
}

const create_item = async (req,res) => {
    const {name,des,price,qty} = req.body
    if (!name||!des||!price||!qty) return res.status(422).json({status:{error:true,message:'name,desc,price and qty are required'}})

    let addItem
    try {
        addItem = await query('INSERT INTO items(name,des,price,qty) VALUES (?,?,?,?)',[name,des,price,qty])
    } catch (err){
        return res.status(409).json({status:{error:true,message:'Error while creating item'},err})
    }
    res.status(200).json({status:{error:null,message:`${name} has been created`}})
}

const remove_item = async (req,res) => {
    const {id} = req.params
    try {
        const deleteItem = await query('DELETE FROM items WHERE id = ?',id)
        if (deleteItem.affectedRows===0) return res.json({status:{error:true,message:'Not found input item id'}})
        res.json({status:{error:null,message:`Item id:${id} has been removed`}})
    } catch {
        return res.status(409).json({status:{error:true,message:'Error while removing item'}})
    }
}


const buy_item = async (req,res) => {
    const items = req.body
    if (!items||!Array.isArray(items)) return  res.status(422).json({status:{error:true,message:'array of items are required'}})
    let lists = []
    let currentItem
     for (x of items){
        if (!x.id||!x.qty) return res.status(422).json({status:{error:true,message:'id and qty are required'}})

        
        try {
            currentItem = await query('SELECT name,qty,price FROM items WHERE id = ?',x.id)
        } catch {
            return res.status(409).json({status:{error:true,message:'Error while checking current item'}})
        }
        if (currentItem.length===0) return res.status(409).json({status:{error:true,message:`Not found input ID: ${x.id}`}})
        const newQTY = currentItem[0].qty - x.qty
        if (newQTY<0) {
            return res.status(409).json({status:{error:true,message:`Can't completing orders, ${currentItem[0].name} have only ${currentItem[0].qty} lefts `}})
        } else {
            const newPrice = x.qty * currentItem[0].price
            lists.push({
                id:x.id,
                newQTY:newQTY,
                qty:x.qty,
                price:newPrice
            })
        }
    }

        let newOrder
        try {
            newOrder = await query('SELECT max(order_no) as maxNo FROM orders')
        } catch {
            return res.status(409).json({status:{error:true,message:'Error while checking order no.'}})
        }
        const orderNo = newOrder[0].maxNo+1
        let buyItem
        let order
        lists.map(async x=>{
            try {
                buyItem = await query('UPDATE items SET qty = ? WHERE id = ?',[x.newQTY,x.id])
                order = await query('INSERT INTO orders(order_no,item_id,qty,price,purchasedBy) VALUES (?,?,?,?,?)',[orderNo,x.id,x.qty,x.price,req.user.username])
            } catch {
                return res.status(409).json({status:{error:true,message:'Error while creating order'}})
            }
        })
    
    res.status(200).json({status:{error:null,message:`Purchased completed`}})
}

const edit_item = async (req,res)=>{
    const {id} = req.params
    const {name,qty,price,des} = req.body
    if (!name||!qty||!price||!des) return res.status(422).json({status:{error:true,message:'name,qty,price and des are required'}})

    try {
        editItem = await query('UPDATE items SET name=?,qty=?,price=?,des=? WHERE id =?',[name,qty,price,des,id])
        if (editItem.affectedRows==0) return res.status(409).json({status:{error:true,message:`Not found item ID: ${id}`}})
    } catch {
        return res.status(409).json({status:{error:true,message:'Error while editing item'}})
    }
   
    res.status(200).json({status:{error:null,message:`Item has been updated`}})
}

const add_qty = async (req,res)=>{
    const {id} = req.params
    const {qty} = req.body
    if (!qty) return res.status(422).json({status:{error:true,message:'qty is required'}})

    try {
        addUnits = await query('UPDATE items SET qty=? WHERE id =?',[qty,id])
        if (addUnits.affectedRows==0) return res.status(409).json({status:{error:true,message:`Not found item ID: ${id}`}})
    } catch {
        return res.status(409).json({status:{error:true,message:'Error while adding item'}})
    }
   
    res.status(200).json({status:{error:null,message:`Item has been updated`}})
}



module.exports = {
    all_items,
    create_item,
    remove_item,
    buy_item,
    edit_item,
    add_qty
}
