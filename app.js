const input = document.getElementById("taskinput");
const btn = document.getElementById("addBtn");
const list = document.getElementById("list");
const sayingElement = document.getElementById("sayings");


let todos = JSON.parse(localStorage.getItem("todos") || "[]");


//定义怪话数组
const sayingsList = [
  "今日事今日毕喵~",
  "先做了再说喵~",
  "熬夜伤身喵~",
  "摸鱼也要讲基本法喵！",
  "DDL 是第一生产力喵~",
  "躺平只是战术性撤退喵。",
  "咖啡续命，猫条续魂喵。",
  "早八是世界的 bug 喵。",
  "把讨厌的事做完就能讨厌得更理直气壮喵。",
  "人类最大的勇气是周一早上按掉闹钟喵。",
  "进度条 99% 和 0% 一样令人崩溃喵。",
  "deadline 前一夜，键盘声都是心跳喵。",
  "先写 to-do，再写遗书，最后发现是同一份喵。",
  "别骂了，在动了，尾巴都卷成螺旋桨了喵。",
  "努力不一定成功，但不努力一定轻松喵。",
  "打工猫，打工魂，打工都是人上人喵。",
  "今天的你，也是一条努力不翻车的咸鱼喵。",
  "生活就像激光笔，永远追不到但永远上头喵。",
  "把焦虑拆成小块，一口一口吃掉喵。",
  "如果世界太吵，就戴上耳机做一只静音猫喵。",
  "任务清单：①活下去 ②做完它 ③继续活下去喵。",
  "别催，在加载，猫脑 CPU 39℃ 过热了喵。",
  "失败是成功之母，拖延是失败它爹喵。",
  "人生苦短，先睡午觉，再冲咖啡，再睡午觉喵。",
  "只要跑得够快，deadline 就追不上我喵。",
  "今天搬砖不狠，明天地位不稳喵。",
  "猫条可以续命，爱情只会阻塞线程喵。",
  "把“算了”改成“干完再摆烂”，气场+50 喵。",
  "再小的进度条，也是向前喵。",
  "愿你走出半生，归来仍是带薪摸鱼猫喵。"
];

function getRandomSaying() {
  const index = Math.floor(Math.random() * sayingsList.length);
  return sayingsList[index];
}

function initSayings() {
  if (!sayingElement) return
  sayingElement.textContent = getRandomSaying();
}

sayingElement.addEventListener('click', function () {
  this.style.opacity = '0';
  this.style.transform = 'translateY(-6px)';
  setTimeout(() => {
    this.textContent = getRandomSaying();
    this.style.opacity = '1';
    this.style.transform = 'translateY(0)';
  }, 350);
});

initSayings();



function render() {
  if (!list) return;

  list.innerHTML = "";
  todos.forEach((element) => {
    const li = document.createElement("li");
    li.dataset.id = element.id;

    //勾选框
    const ck = document.createElement("input");
    ck.type = "checkbox";
    ck.checked = element.done;
    ck.addEventListener("change", () => toggleDone(element.id));

    //文字
    const span = document.createElement("span");
    span.textContent = element.text;
    if (element.done) span.classList.add("done");

    //删除按钮
    const del = document.createElement("button");
    del.textContent = "删除";
    del.addEventListener("click", () => removeItem(element.id));

    li.append(ck, span, del);
    list.appendChild(li);
  });
}
render();

function toggleDone(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  localStorage.setItem("todos", JSON.stringify(todos));
  render();
}

function removeItem(id) {
  todos = todos.filter((t) => t.id !== id);
  localStorage.setItem("todos", JSON.stringify(todos));
  render();
}

function addTask() {
  const text = input.value.trim(); //获取输入内容
  if (!text) return; //防止内容为空
  todos.push({ id: Date.now(), text, done: false });
  localStorage.setItem("todos", JSON.stringify(todos));
  render();
  input.value = ""; //清空输入框
  input.focus(); //光标回调
}

btn.addEventListener("click", addTask);
input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addTask();
});
