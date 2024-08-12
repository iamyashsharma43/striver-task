import React, { useRef } from 'react';

function Header({ categories, onGenerate }) {
  const categoryEl = useRef();
  const amountEl = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const category = categoryEl.current.value;
    const amount = amountEl.current.value;
    onGenerate(category, amount);
  };

  return (
    <form className="header" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" ref={categoryEl}>
          {categories.map(category => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="amount">Number of Questions</label>
        <input
          type="number"
          id="amount"
          min="1"
          step="1"
          defaultValue={10}
          ref={amountEl}
        />
      </div>
      <div className="form-group">
        <button className="btn">Generate</button>
      </div>
    </form>
  );
}

export default Header;
