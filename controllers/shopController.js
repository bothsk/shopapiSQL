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
    const {id,qty} = req.body
    if (!id||!qty) return res.status(422).json({status:{error:true,message:'id and qty are required'}})

    let currentQTY
    try {
        currentQTY = await query('SELECT name,qty FROM items WHERE id = ?',id)
    } catch {
        return res.status(409).json({status:{error:true,message:'Error while checking current qty'}})
    }

    const newQTY = currentQTY[0].qty - qty
    let buyItem
    try {
        buyItem = await query('UPDATE items SET qty = ? WHERE id = ?',[newQTY,id])
    } catch {
        return res.status(409).json({status:{error:true,message:'Error while updating qty'}})
    }

    res.status(200).json({status:{error:null,message:`${currentQTY[0].name} has been updated`}})
}


module.exports = {
    all_items,
    create_item,
    remove_item,
    buy_item
}
