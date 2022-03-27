import React, { useState, useEffect } from "react";

const SortUsers = (props) => {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([
    {
      item: "none",
      score: 0,
    },
  ]);
  const [guess, setGuess] = useState("");

  const getUsers = async () => {
    let users = [];
    console.log("getting users");
    await props.firestore
      .collection("users")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          users.push({
            item: doc.data().name,
            score: 0,
          });
        });
      })
      .then(() => {
        setItems(users);
      });
    console.table(users);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const searchTerm = () => {
    let searchArr = search.split("");
    let catcher = [];

    for (const u of items) {
      let score = 0;
      let uArr = u.item.split("");
      let uArray = [];

      uArr.forEach((u) => {
        uArray.push(u.toLowerCase());
      });
      uArr = uArr.filter((u) => u !== " ");
      console.log("uArray: " + uArray);
      for (let i = 0; i < searchArr.length; i++) {
        if (uArray.includes(searchArr[i])) {
          if (uArray[i] === searchArr[i]) {
            if (uArray[i - 1] === searchArr[i - 1]) {
              if (uArray[i - 2] === searchArr[i - 2]) {
                score++;
              }
              score++;
            }
            if (uArray[i + 1] === searchArr[i + 1]) {
              if (uArray[i + 2] === searchArr[i + 2]) {
                score++;
              }
              score++;
            }
            score++;
          }
          score++;
        }
      }
      catcher.push({
        item: u.item,
        score: score,
      });
    }
    catcher.sort((a, b) => b.score - a.score);
    setItems([...catcher]);

    if (catcher[0].score > catcher[1].score * 1.25) {
      setGuess(catcher[0]);
    } else {
      setGuess({
        item: "-",
        score: 0,
      });
    }
  };

  return (
    <div className="sort-users-page">
      <p>You are probably looking for {guess.item}</p>
      <p>Score: {guess.score}</p>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={() => searchTerm()}>Search</button>
      {items &&
        items.map((i) => (
          <p>
            {i.item ? i.item : null} - Score: {i.score ? i.score : "0"}
          </p>
        ))}
    </div>
  );
};

export default SortUsers;
