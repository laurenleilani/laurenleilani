const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let exp = parseInt(localStorage.getItem('exp')) || 0;
let level = parseInt(localStorage.getItem('level')) || 1;
let history = JSON.parse(localStorage.getItem('history')) || [];
let archive = JSON.parse(localStorage.getItem('archive')) || [];
let rewards = JSON.parse(localStorage.getItem('rewards')) || [];
let rainbowHeartsEarned = parseInt(localStorage.getItem('rainbowHeartsEarned')) || 0;
let rainbowHeartsSpent = parseInt(localStorage.getItem('rainbowHeartsSpent')) || 0;
let rewardsRedeemed = parseInt(localStorage.getItem('rewardsRedeemed')) || 0;
let currentTheme = localStorage.getItem('theme') || 'light';
let selectedTaskIndex = null;
let selectedRewardIndex = null;
let sortOrder = 'newest';

const difficultyEXP = {
    easy: 10,
    medium: 20,
    hard: 40,
    nightmare: 80,
};

const fairyImages = {
    light: [
        'https://moonpr1sm.neocities.org/games/exp/img/Fairy.png',
        'https://moonpr1sm.neocities.org/games/exp/img/Fairy2.png'
    ],
    dark: [
        'https://moonpr1sm.neocities.org/games/exp/img/Fairy.png',
        'https://moonpr1sm.neocities.org/games/exp/img/Fairy2.png'
    ],
    toad: [
        'https://moonpr1sm.neocities.org/games/exp/img/toadmode/Toad_1.png',
        'https://moonpr1sm.neocities.org/games/exp/img/toadmode/Toad_2.png'
    ]
};

const heartImages = {
    light: [
        'https://moonpr1sm.neocities.org/games/exp/img/Pink_Heart.png',
        'https://moonpr1sm.neocities.org/games/exp/img/Yellow_Heart.png',
        'https://moonpr1sm.neocities.org/games/exp/img/Blue_Heart.png',
        'https://moonpr1sm.neocities.org/games/exp/img/Purple_Heart.png'
    ],
    dark: [
        'https://moonpr1sm.neocities.org/games/exp/img/Pink_Heart.png',
        'https://moonpr1sm.neocities.org/games/exp/img/Yellow_Heart.png',
        'https://moonpr1sm.neocities.org/games/exp/img/Blue_Heart.png',
        'https://moonpr1sm.neocities.org/games/exp/img/Purple_Heart.png'
    ],
    toad: [
        'https://moonpr1sm.neocities.org/games/exp/img/toadmode/Complete_Frog_Egg.png'
    ]
};

const emptyHeartImages = {
    light: 'https://moonpr1sm.neocities.org/games/exp/img/Empty_Heart%202.png',
    dark: 'https://moonpr1sm.neocities.org/games/exp/img/Empty_Heart%202.png',
    toad: 'https://moonpr1sm.neocities.org/games/exp/img/toadmode/Empty_Frog_Egg.png'
};

const badgeImages = {
    light: 'https://moonpr1sm.neocities.org/games/exp/img/Rainbow_Heart.png',
    dark: 'https://moonpr1sm.neocities.org/games/exp/img/Rainbow_Heart.png',
    toad: 'https://moonpr1sm.neocities.org/games/exp/img/toadmode/Tadpole.png'
};

const sounds = {
    light: {
        add: 'https://moonpr1sm.neocities.org/games/exp/sounds/Add.mp3',
        complete: 'https://moonpr1sm.neocities.org/games/exp/sounds/Complete.mp3',
        delete: 'https://moonpr1sm.neocities.org/games/exp/sounds/Delete.mp3',
        levelUp: 'https://moonpr1sm.neocities.org/games/exp/sounds/Level%20Up.mp3',
        redeem: 'https://moonpr1sm.neocities.org/games/exp/sounds/Redeem.mp3',
        clear: 'https://moonpr1sm.neocities.org/games/exp/sounds/Clear.mp3'
    },
    dark: {
        add: 'https://moonpr1sm.neocities.org/games/exp/sounds/Add.mp3',
        complete: 'https://moonpr1sm.neocities.org/games/exp/sounds/Complete.mp3',
        delete: 'https://moonpr1sm.neocities.org/games/exp/sounds/Delete.mp3',
        levelUp: 'https://moonpr1sm.neocities.org/games/exp/sounds/Level%20Up.mp3',
        redeem: 'https://moonpr1sm.neocities.org/games/exp/sounds/Redeem.mp3',
        clear: 'https://moonpr1sm.neocities.org/games/exp/sounds/Clear.mp3'
    },
    toad: {
        add: 'https://moonpr1sm.neocities.org/games/exp/sounds/swamp/Toad%20Add.mp3',
        complete: 'https://moonpr1sm.neocities.org/games/exp/sounds/swamp/Toad%20Complete.mp3',
        delete: 'https://moonpr1sm.neocities.org/games/exp/sounds/swamp/Toad%20Delete.mp3',
        levelUp: 'https://moonpr1sm.neocities.org/games/exp/sounds/swamp/Toad%20Level%20Up.mp3',
        redeem: 'https://moonpr1sm.neocities.org/games/exp/sounds/swamp/Toad%20Redeem.mp3',
        clear: 'https://moonpr1sm.neocities.org/games/exp/sounds/Clear.mp3'
    }
};

document.documentElement.setAttribute('data-theme', currentTheme);

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateModalStyles();
    updateThemeAssets(theme);
}

function updateThemeAssets(theme) {
    document.querySelectorAll('.fairy').forEach((fairy, index) => {
        fairy.src = fairyImages[theme][index % fairyImages[theme].length];
    });
    document.querySelectorAll('.complete-heart').forEach((heart) => {
        heart.src = emptyHeartImages[theme];
    });
    document.querySelectorAll('.badge').forEach((badge) => {
        badge.src = badgeImages[theme];
    });
}

function playSound(soundType) {
    const theme = localStorage.getItem('theme') || 'light';
    const soundUrl = sounds[theme][soundType];
    const audio = new Audio(soundUrl);
    audio.play();
}

function hoverHeart(element) {
    const theme = localStorage.getItem('theme') || 'light';
    element.src = heartImages[theme][Math.floor(Math.random() * heartImages[theme].length)];
}

function resetHeart(element) {
    const theme = localStorage.getItem('theme') || 'light';
    element.src = emptyHeartImages[theme];
}

document.getElementById('fairy1').addEventListener('click', () => {
    showFairyMessage('This tracker can only work on an honor system. Please be honest with yourself!');
});

document.getElementById('fairy2').addEventListener('click', () => {
    showFairyMessage('I mean, you don\'t really have to be honest, but why lie about it lol');
});

function updateStats() {
    document.getElementById('exp').textContent = exp;
    document.getElementById('level').textContent = level;
    document.getElementById('rainbow-hearts-earned').textContent = rainbowHeartsEarned;
    document.getElementById('rainbow-hearts-spent').textContent = rainbowHeartsSpent;
    document.getElementById('rewards-redeemed').textContent = rewardsRedeemed;
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const levelBaseExp = (level - 1) * 100;
    const nextLevelExp = level * 100;
    const progress = ((exp - levelBaseExp) / (nextLevelExp - levelBaseExp)) * 100;
    progressBar.style.width = progress + '%';
    document.getElementById('exp-to-next').textContent = `${nextLevelExp - exp} EXP to next level`;
}

function addTask() {
    playSound('add');
    const taskInput = document.getElementById('new-task');
    const taskDifficulty = document.getElementById('task-difficulty').value;
    const taskText = taskInput.value.trim();
    const taskExp = difficultyEXP[taskDifficulty];
    const taskDate = new Date().toISOString();

    if (taskText !== '' && taskExp) {
        tasks.push({ text: taskText, exp: taskExp, completed: false, date: taskDate });
        updateLocalStorage('tasks', tasks);
        taskInput.value = '';
        document.getElementById('task-difficulty').value = '';
        updateTaskList();
    } else {
        alert("Please enter a valid task and select a difficulty.");
    }
}

function completeTask(index) {
    tasks[index].completed = true;
    tasks[index].date = new Date().toISOString();
    exp += tasks[index].exp;

    let heartsEarned = 1;
    if (Math.random() < 0.1) {
        heartsEarned = 2;
        alert(`Level Up! We're feeling generous - you get 2 Reward Badges this time!`);
    }

    while (exp >= level * 100) {
        level++;
        if (heartsEarned === 1) {
            alert('Level Up!');
        }
        for (let i = 0; i < heartsEarned; i++) {
            addBadge();
        }
        playSound('levelUp');
    }

    history.push({ ...tasks[index], type: 'task' });
    tasks.splice(index, 1);
    updateLocalStorage('tasks', tasks);
    updateLocalStorage('exp', exp);
    updateLocalStorage('level', level);
    updateLocalStorage('history', history);
    updateStats();
    playSound('complete');
    updateProgressBar();
    updateTaskList();
    updateHistoryAndStats();
}

function deleteTask(index) {
    playSound('delete');
    tasks.splice(index, 1);
    updateLocalStorage('tasks', tasks);
    updateTaskList();
}

function showBombConfirmation() {
    document.getElementById('bomb-confirmation-box').style.display = 'block';
}

function closeBombConfirmation() {
    document.getElementById('bomb-confirmation-box').style.display = 'none';
}

function clearAll() {
    playSound('clear');
    tasks.length = 0;
    exp = 0;
    level = 1;
    history.length = 0;
    archive.length = 0;
    rewards.length = 0;
    rainbowHeartsEarned = 0;
    rainbowHeartsSpent = 0;
    rewardsRedeemed = 0;
    updateLocalStorage('tasks', tasks);
    updateLocalStorage('exp', exp);
    updateLocalStorage('level', level);
    updateLocalStorage('history', history);
    updateLocalStorage('archive', archive);
    updateLocalStorage('rewards', rewards);
    updateLocalStorage('rainbowHeartsEarned', rainbowHeartsEarned);
    updateLocalStorage('rainbowHeartsSpent', rainbowHeartsSpent);
    updateLocalStorage('rewardsRedeemed', rewardsRedeemed);
    updateStats();
    updateProgressBar();
    clearBadges();
    updateTaskList();
    updateHistoryAndStats();
    updateArchive();
    updateRewardList();
    closeBombConfirmation();
}

window.onclick = function (event) {
    const modal = document.getElementById('info-modal');
    const bombConfirmationBox = document.getElementById('bomb-confirmation-box');
    const archiveConfirmationBox = document.getElementById('archive-confirmation-box');
    const themeOptions = document.getElementById('theme-options');
    if (event.target === modal) {
        modal.style.display = 'none';
    } else if (event.target === bombConfirmationBox) {
        bombConfirmationBox.style.display = 'none';
    } else if (event.target === archiveConfirmationBox) {
        archiveConfirmationBox.style.display = 'none';
    } else if (!event.target.matches('.theme-toggle-button')) {
        themeOptions.style.display = 'none';
    }
};

function showArchiveConfirmation() {
    document.getElementById('archive-confirmation-box').style.display = 'block';
}

function closeArchiveConfirmation() {
    document.getElementById('archive-confirmation-box').style.display = 'none';
}

function confirmArchive() {
    archiveHistory();
    closeArchiveConfirmation();
}

function clearBadges() {
    document.getElementById('badges').innerHTML = '';
    updateLocalStorage('badges', []);
}

function addBadge() {
    const badgesContainer = document.getElementById('badges');
    const badge = document.createElement('img');
    const theme = localStorage.getItem('theme') || 'light';
    badge.src = badgeImages[theme];
    badge.className = 'badge';
    badgesContainer.appendChild(badge);

    updateLocalStorage('badges', Array.from(badgesContainer.children).map(child => child.src));
    rainbowHeartsEarned++;
    updateLocalStorage('rainbowHeartsEarned', rainbowHeartsEarned);
    document.getElementById('rainbow-hearts-earned').textContent = rainbowHeartsEarned;
}

function removeBadge() {
    const badgesContainer = document.getElementById('badges');
    if (badgesContainer.lastChild) {
        badgesContainer.removeChild(badgesContainer.lastChild);
        updateLocalStorage('badges', Array.from(badgesContainer.children).map(child => child.src));
    }
}

function loadBadges() {
    const badgesContainer = document.getElementById('badges');
    const savedBadges = JSON.parse(localStorage.getItem('badges')) || [];
    if (Array.isArray(savedBadges)) {
        savedBadges.forEach(src => {
            const badge = document.createElement('img');
            badge.src = src;
            badge.className = 'badge';
            badgesContainer.appendChild(badge);
        });
    }
}

window.onload = function () {
    updateTaskList();
    updateProgressBar();
    updateHistoryAndStats();
    loadBadges();
    updateArchive();
    updateRewardList();
    updateModalStyles();
    updateStats();
    updateThemeAssets(currentTheme);
}

function updateTaskList() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.setAttribute('draggable', true);
        li.setAttribute('data-index', index);
        li.innerHTML = `
                    <button class="delete-button" onclick="deleteTask(${index})" aria-label="Delete Task"></button>
                    <span class="task-text">${task.text} (EXP: ${task.exp}) - Added on ${new Date(task.date).toLocaleDateString()}</span>
                    <img src="${emptyHeartImages[currentTheme]}" class="complete-heart"
                    onclick="completeTask(${index})"
                    onmouseover="hoverHeart(this)"
                    onmouseout="resetHeart(this)">
                `;
        taskList.appendChild(li);
    });

    taskList.querySelectorAll('li').forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragover', dragOver);
        draggable.addEventListener('drop', drop);
    });
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData('text/plain');
    const targetIndex = e.target.closest('li').dataset.index;
    if (draggedIndex !== targetIndex) {
        swapTasks(draggedIndex, targetIndex);
        updateTaskList();
    }
}

function swapTasks(fromIndex, toIndex) {
    [tasks[fromIndex], tasks[toIndex]] = [tasks[toIndex], tasks[fromIndex]];
    updateLocalStorage('tasks', tasks);
}

function updateHistoryAndStats() {
    const allHistory = history.concat(archive);
    const totalTasks = allHistory.filter(item => item.type === 'task').length;
    const weeklyTasks = allHistory.filter(item => item.type === 'task' && new Date(item.date) >= new Date(new Date().setDate(new Date().getDate() - 7))).length;
    const monthlyTasks = allHistory.filter(item => item.type === 'task' && new Date(item.date) >= new Date(new Date().setMonth(new Date().getMonth() - 1))).length;

    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('weekly-tasks').textContent = weeklyTasks;
    document.getElementById('monthly-tasks').textContent = monthlyTasks;

    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    history.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        if (item.type === 'task') {
            li.innerHTML = `${item.text} (EXP: ${item.exp}) - Completed on ${new Date(item.date).toLocaleDateString()}
                        <button onclick="undoTask(${index})" aria-label="Undo Task">Undo</button>`;
        } else if (item.type === 'reward') {
            li.innerHTML = `Reward: ${item.text} (Cost: ${item.cost} Rainbow Hearts) - Redeemed on ${new Date(item.date).toLocaleDateString()}`;
        } else if (item.type === 'reward-set') {
            li.innerHTML = `Reward Set: ${item.text} - Set on ${new Date(item.date).toLocaleDateString()}`;
        }
        historyList.prepend(li);
    });
}

function undoTask(index) {
    const task = history[index];
    if (task.type === 'task') {
        exp -= task.exp;
        if (exp < 0) exp = 0;

        while (exp < (level - 1) * 100 && level > 1) {
            level--;
            alert('Level Down!');
            removeBadge();
        }

        tasks.push(task);
        history.splice(index, 1);
        updateLocalStorage('tasks', tasks);
        updateLocalStorage('exp', exp);
        updateLocalStorage('level', level);
        updateLocalStorage('history', history);
        updateStats();
        updateProgressBar();
        updateTaskList();
        updateHistoryAndStats();
    }
}

function toggleHistoryStats(event) {
    const historyStats = document.getElementById('history-stats');
    if (historyStats.style.display === 'none') {
        historyStats.style.display = 'block';
        event.target.textContent = 'Hide History and Statistics';
    } else {
        historyStats.style.display = 'none';
        event.target.textContent = 'Show History and Statistics';
    }
}

function toggleArchiveStats(event) {
    const archiveStats = document.getElementById('archive-stats');
    if (archiveStats.style.display === 'none') {
        archiveStats.style.display = 'block';
        event.target.textContent = 'Hide Archive';
    } else {
        archiveStats.style.display = 'none';
        event.target.textContent = 'Show Archive';
    }
}

function toggleThemeOptions() {
    const themeOptions = document.getElementById('theme-options');
    themeOptions.style.display = themeOptions.style.display === 'block' ? 'none' : 'block';
}

function updateModalStyles() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const modalContent = document.querySelector('.modal-content');
    if (currentTheme === 'dark' || currentTheme === 'toad') {
        modalContent.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
        modalContent.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        modalContent.style.border = `1px solid ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color')}`;
    } else {
        modalContent.style.backgroundColor = '';
        modalContent.style.color = '';
        modalContent.style.border = '';
    }
}

function closeMessageBox() {
    document.getElementById('message-box').style.display = 'none';
}

function showFairyMessage(message) {
    const messageBox = document.getElementById('message-box');
    document.getElementById('message-content').textContent = message;

    document.getElementById('move-task-button').style.display = 'none';
    document.getElementById('delete-task-button').style.display = 'none';

    messageBox.style.display = 'block';
}

function showMessage(message) {
    const messageBox = document.getElementById('message-box');
    document.getElementById('message-content').textContent = message;

    document.getElementById('move-task-button').style.display = 'inline-block';
    document.getElementById('delete-task-button').style.display = 'inline-block';

    messageBox.style.display = 'block';
}

function deleteTaskPermanently() {
    if (selectedTaskIndex !== null && selectedTaskIndex < history.length) {
        const taskExp = history[selectedTaskIndex].exp;
        exp -= taskExp;
        if (exp < 0) exp = 0;
        updateLocalStorage('exp', exp);
        document.getElementById('exp').textContent = exp;

        while (exp < (level - 1) * 100 && level > 1) {
            level--;
            alert('Level Down!');
            removeBadge();
        }

        updateLocalStorage('level', level);
        document.getElementById('level').textContent = level;

        updateProgressBar();
        history.splice(selectedTaskIndex, 1);
        updateLocalStorage('history', history);
        updateHistoryAndStats();
        closeMessageBox();
    }
}

function moveTaskBack() {
    if (selectedTaskIndex !== null && selectedTaskIndex < history.length) {
        const taskExp = history[selectedTaskIndex].exp;
        exp -= taskExp;
        if (exp < 0) exp = 0;
        updateLocalStorage('exp', exp);
        document.getElementById('exp').textContent = exp;

        while (exp < (level - 1) * 100 && level > 1) {
            level--;
            alert('Level Down!');
            removeBadge();
        }

        updateLocalStorage('level', level);
        document.getElementById('level').textContent = level;

        updateProgressBar();
        history[selectedTaskIndex].completed = false;
        tasks.push(history[selectedTaskIndex]);
        history.splice(selectedTaskIndex, 1);
        updateLocalStorage('tasks', tasks);
        updateLocalStorage('history', history);
        updateTaskList();
        updateHistoryAndStats();
        closeMessageBox();
    }
}

function promptDeleteOrRestore(index) {
    selectedTaskIndex = index;
    showMessage("Do you want to move this task back to the task list or delete it?");
}

function archiveHistory() {
    archive = archive.concat(history);
    updateLocalStorage('archive', archive);
    history = [];
    updateLocalStorage('history', history);
    updateArchive();
    updateHistoryAndStats();
}

function updateArchive() {
    const archiveList = document.getElementById('archive-list');
    archiveList.innerHTML = '';
    archive.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'archive-item';
        li.innerHTML = `${task.text} (EXP: ${task.exp}) - Completed on ${new Date(task.date).toLocaleDateString()}`;
        archiveList.prepend(li);
    });
}

function addReward() {
    const rewardInput = document.getElementById('new-reward');
    const rewardTier = document.getElementById('reward-tier').value;
    const rewardText = rewardInput.value.trim();
    if (rewardText !== '' && rewardTier) {
        playSound('add');
        rewards.push({ text: rewardText, tier: rewardTier });
        updateLocalStorage('rewards', rewards);
        rewardInput.value = '';
        document.getElementById('reward-tier').value = '';
        updateRewardList();

        history.push({ type: 'reward-set', text: rewardText, date: new Date().toISOString() });
        updateLocalStorage('history', history);
        updateHistoryAndStats();
    } else {
        alert("Please enter a valid reward and select a reward tier.");
    }
}

function deleteReward(index) {
    playSound('delete');
    rewards.splice(index, 1);
    updateLocalStorage('rewards', rewards);
    updateRewardList();
}

function updateRewardList() {
    const rewardList = document.getElementById('reward-list');
    rewardList.innerHTML = '';
    rewards.forEach((reward, index) => {
        const heartCount = reward.tier === 'small' ? 1 : reward.tier === 'big' ? 5 : reward.tier === 'legendary' ? 10 : 0;
        const li = document.createElement('li');
        li.innerHTML = `
                    <button class="delete-button" onclick="deleteReward(${index})" aria-label="Delete Reward"></button>
                    <span class="reward-text">${reward.text} (${heartCount} Reward Badges)</span>
                    <img src="${emptyHeartImages[currentTheme]}" class="redeem-heart"
                    onclick="promptRewardExchange(${index})"
                    onmouseover="hoverHeart(this)"
                    onmouseout="resetHeart(this)">
                `;
        rewardList.appendChild(li);
    });
}

function promptRewardExchange(index) {
    selectedRewardIndex = index;
    const reward = rewards[index];
    const heartCount = reward.tier === 'small' ? 1 : reward.tier === 'big' ? 5 : reward.tier === 'legendary' ? 10 : 0;
    showRewardMessage(`Do you want to exchange ${heartCount} Reward Badges for "${reward.text}"?`);
}

function showRewardMessage(message) {
    const messageBox = document.getElementById('reward-message-box');
    const fairyImg = document.getElementById('reward-fairy-img');
    document.getElementById('reward-message-content').textContent = message;

    const theme = localStorage.getItem('theme') || 'light';
    fairyImg.src = fairyImages[theme][Math.floor(Math.random() * fairyImages[theme].length)];
    messageBox.style.display = 'block';
}

function closeRewardMessageBox() {
    document.getElementById('reward-message-box').style.display = 'none';
    document.getElementById('reward-fairy-img').src = '';
}

function confirmReward() {
    if (selectedRewardIndex !== null && selectedRewardIndex < rewards.length) {
        const reward = rewards[selectedRewardIndex];
        const heartCount = reward.tier === 'small' ? 1 : reward.tier === 'big' ? 5 : reward.tier === 'legendary' ? 10 : 0;
        const badgesContainer = document.getElementById('badges');
        if (badgesContainer.children.length >= heartCount) {
            for (let i = 0; i < heartCount; i++) {
                badgesContainer.removeChild(badgesContainer.lastChild);
            }
            updateLocalStorage('badges', Array.from(badgesContainer.children).map(child => child.src));

            rainbowHeartsSpent += heartCount;
            updateLocalStorage('rainbowHeartsSpent', rainbowHeartsSpent);
            document.getElementById('rainbow-hearts-spent').textContent = rainbowHeartsSpent;

            rewardsRedeemed++;
            updateLocalStorage('rewardsRedeemed', rewardsRedeemed);
            document.getElementById('rewards-redeemed').textContent = rewardsRedeemed;

            history.push({ type: 'reward', text: reward.text, cost: heartCount, date: new Date().toISOString() });
            updateLocalStorage('history', history);
            updateHistoryAndStats();

            rewards.splice(selectedRewardIndex, 1);
            updateLocalStorage('rewards', rewards);
            updateRewardList();
            closeRewardMessageBox();

            playSound('redeem');
            alert(`You redeemed "${reward.text}"! Enjoy your reward!`);
        } else {
            alert("You don't have enough Reward Badges for this reward.");
        }
    }
}

function exportData() {
    const data = {
        tasks,
        exp,
        level,
        history,
        archive,
        rewards,
        badges: JSON.parse(localStorage.getItem('badges')) || [],
        rainbowHeartsEarned,
        rainbowHeartsSpent,
        rewardsRedeemed,
        theme: currentTheme,
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "exp_tracker_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const importedData = JSON.parse(event.target.result);
            tasks.splice(0, tasks.length, ...(importedData.tasks || []));
            exp = importedData.exp || 0;
            level = importedData.level || 1;
            history.splice(0, history.length, ...(importedData.history || []));
            archive.splice(0, archive.length, ...(importedData.archive || []));
            rewards.splice(0, rewards.length, ...(importedData.rewards || []));
            rainbowHeartsEarned = importedData.rainbowHeartsEarned || 0;
            rainbowHeartsSpent = importedData.rainbowHeartsSpent || 0;
            rewardsRedeemed = importedData.rewardsRedeemed || 0;
            currentTheme = importedData.theme || 'light';
            localStorage.setItem('theme', currentTheme);

            // Ensure badges is an array before loading it
            const savedBadges = importedData.badges;
            if (Array.isArray(savedBadges)) {
                localStorage.setItem('badges', JSON.stringify(savedBadges));
                loadBadges();
            } else {
                clearBadges();
            }

            document.documentElement.setAttribute('data-theme', currentTheme);
            updateLocalStorage('tasks', tasks);
            updateLocalStorage('exp', exp);
            updateLocalStorage('level', level);
            updateLocalStorage('history', history);
            updateLocalStorage('archive', archive);
            updateLocalStorage('rewards', rewards);
            updateLocalStorage('rainbowHeartsEarned', rainbowHeartsEarned);
            updateLocalStorage('rainbowHeartsSpent', rainbowHeartsSpent);
            updateLocalStorage('rewardsRedeemed', rewardsRedeemed);

            updateStats();
            updateProgressBar();
            updateTaskList();
            updateHistoryAndStats();
            updateArchive();
            updateRewardList();
            updateModalStyles();
        } catch (error) {
            console.error('Error importing data:', error);
            alert('There was an error importing your data. Please ensure the file is in the correct format.');
        }
    };
    reader.readAsText(file);
}

function updateLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Error setting local storage:', e);
    }
}

function openInfoModal() {
    document.getElementById('info-modal').style.display = 'block';
}

function closeInfoModal() {
    document.getElementById('info-modal').style.display = 'none';
}

function toggleSortMenu() {
    const sortOptions = document.getElementById('sort-options');
    sortOptions.style.display = sortOptions.style.display === 'block' ? 'none' : 'block';
}

function sortTasks(order) {
    if (order === 'newest') {
        tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (order === 'oldest') {
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    updateTaskList();
    toggleSortMenu();
}

