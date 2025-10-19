import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787'

function App(){
  const [q, setQ] = useState('alpha sv')
  const [region, setRegion] = useState('ALL')
  const [inStockOnly, setInStockOnly] = useState(true)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(3000)
  const [sortBy, setSortBy] = useState('price-asc')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])

  const run = async () => {
    if(!q.trim()) return
    setLoading(true)
    try{
      const r = await fetch(`${API_BASE}/search?kw=` + encodeURIComponent(q.trim()))
      const data = await r.json()
      const arr = Array.isArray(data.items) ? data.items : []
      setItems(arr)
    } finally {
      setLoading(false)
    }
  }

  const view = useMemo(()=>{
    let arr = [...items]
    if(region !== 'ALL') arr = arr.filter(i => (i.vendorRegion||'').toUpperCase() === region)
    if(inStockOnly) arr = arr.filter(i => i.inStock)
    arr = arr.filter(i => i.price >= minPrice && i.price <= maxPrice)
    switch (sortBy){
      case 'price-asc': arr.sort((a,b)=>a.price-b.price); break
      case 'price-desc': arr.sort((a,b)=>b.price-a.price); break
      case 'rating-desc': arr.sort((a,b)=>(b.rating||0)-(a.rating||0)); break
    }
    return arr
  }, [items, region, inStockOnly, minPrice, maxPrice, sortBy])

  return (
    <div className="container">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'end', marginBottom:16}}>
        <div>
          <h1 style={{margin:'0 0 6px 0'}}>BuyerHub Outdoor（国际站）</h1>
          <div className="muted">仅聚合国外站点：REI / Backcountry / OMCgear / Enwild / Gregory / Mystery Ranch / Osprey</div>
        </div>
        <button className="btn" onClick={run}>{loading ? '搜索中…' : '搜索'}</button>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div className="grid grid-3">
          <div className="row"><input placeholder="输入商品，如：alpha sv / zodiac tech gtx / petzl quark" value={q} onChange={e=>setQ(e.target.value)} /></div>
          <div className="row">
            <select value={region} onChange={e=>setRegion(e.target.value)}>
              <option value="ALL">全部地区</option>
              <option value="US">美国</option>
              <option value="EU">欧洲</option>
              <option value="JP">日本</option>
            </select>
            <label className="row" style={{gap:8}}><input type="checkbox" checked={inStockOnly} onChange={e=>setInStockOnly(e.target.checked)} />仅现货</label>
          </div>
          <div className="row">
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
              <option value="price-asc">价格从低到高</option>
              <option value="price-desc">价格从高到低</option>
              <option value="rating-desc">评分从高到低</option>
            </select>
          </div>
        </div>
        <div className="row" style={{marginTop:12}}>
          <span className="muted">价格区间</span>
          <input type="number" value={minPrice} onChange={e=>setMinPrice(Number(e.target.value)||0)} style={{width:120}} />
          <span>—</span>
          <input type="number" value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value)||0)} style={{width:120}} />
        </div>
      </div>

      {view.length === 0 ? (
        <div className="card">输入关键词并点击「搜索」，或尝试：alpha sv / zodiac tech gtx / petzl quark</div>
      ) : (
        <div className="grid" style={{gap:12}}>
          {view.map(it => (
            <div key={it.id} className="card item">
              <img src={it.image || 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=800&auto=format&fit=crop'} />
              <div>
                <div style={{marginBottom:6}}>
                  <span className="badge">{it.vendor}</span>
                  <span className="badge">{it.vendorRegion || 'US'}</span>
                  {it.brand ? <span className="badge">{it.brand}</span> : null}
                  {it.category ? <span className="badge">{it.category}</span> : null}
                  {it.inStock ? <span className="badge" style={{background:'#10b981',color:'#fff'}}>现货</span> : <span className="badge">缺货</span>}
                </div>
                <a href={it.url} target="_blank" className="title">{it.title}</a>
                <div className="muted" style={{marginTop:6}}>{it.rating ? `评分 ${it.rating}★` : ''}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="price">${it.price} {it.currency || 'USD'}</div>
                <div style={{marginTop:8}}>
                  <a href={it.url} target="_blank" className="btn primary">去购买</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App/>)
