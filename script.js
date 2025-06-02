document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const stampAreas = document.querySelectorAll('.stamp-area');
    const stampOptions = document.querySelectorAll('.stamp-option');
    let selectedStamp = null; // 現在選択中のスタンプの種類を保持する変数

    // 各スタンプの重なり具合を調整するためのオフセット値
    const STAMP_OFFSET_PX = 5; 
    // const MAX_STAMPS_PER_DAY = 3; // 各日付に押せるスタンプの最大数 → 何回でも押せるようにするためコメントアウトまたは削除

    // localStorageから保存されたスタンプ情報を読み込む
    // 各日付には、スタンプの種類とオフセット情報を持つオブジェクトの配列を保存
    // 例: { "day-1": [{type: "cana-stamp", offset: 0}, {type: "cana-stamp", offset: 5}], ... }
    const savedStamps = JSON.parse(localStorage.getItem('stamps')) || {};
    
    // ページ読み込み時に保存されたスタンプをカレンダーに表示する
    displaySavedStamps();

    /**
     * 保存されたスタンプ情報をカレンダーに表示する関数
     */
    function displaySavedStamps() {
        stampAreas.forEach(area => {
            const dayId = area.id; 
            // stampsForDayが配列であることを確実にチェック
            const stampsForDay = Array.isArray(savedStamps[dayId]) ? savedStamps[dayId] : [];

            // 既存のスタンプ画像をすべて削除（重複表示を防ぐため）
            area.innerHTML = ''; 

            // 保存されたスタンプをすべて表示
            stampsForDay.forEach((stampData, index) => {
                const img = document.createElement('img');
                img.src = `${stampData.type}.png`; 
                img.style.left = `${stampData.offset}px`; // 保存されたオフセットを適用
                img.style.top = `${stampData.offset}px`; // topも同じオフセットでずらす
                img.style.zIndex = index + 1; // 後から押したスタンプが手前に来るようにz-indexを設定
                area.appendChild(img);
            });
        });
    }

    /**
     * スタンプ選択肢がクリックされたときの処理
     */
    stampOptions.forEach(option => {
        option.addEventListener('click', () => {
            // 現在選択されているスタンプの 'selected' クラスをすべて解除
            stampOptions.forEach(opt => opt.classList.remove('selected'));
            
            // クリックされたスタンプに 'selected' クラスを付与
            option.classList.add('selected');
            
            // data-stamp 属性からスタンプの種類を取得し、selectedStamp変数に格納
            selectedStamp = option.dataset.stamp;
            console.log(`選択されたスタンプ: ${selectedStamp}`);
        });
    });

    // ページが読み込まれたら、最初のスタンプを自動的に選択状態にする (ユーザー体験向上のため)
    if (stampOptions.length > 0) {
        stampOptions.item(0).click();
    }

    /**
     * カレンダーの日付エリアがクリックされたときの処理 (スタンプを押す)
     */
    stampAreas.forEach(area => {
        area.addEventListener('click', () => {
            if (selectedStamp) { // スタンプが選択されている場合のみ処理を実行
                const dayId = area.id;
                // その日の現在のスタンプリストを取得、なければ新しい配列を初期化
                // ここもArray.isArrayでチェック
                const stampsForDay = Array.isArray(savedStamps[dayId]) ? savedStamps[dayId] : [];

                // ★何回でもスタンプを押せるように制限を削除しました★
                // if (stampsForDay.length < MAX_STAMPS_PER_DAY) { // このif文を削除
                    const currentStampCount = stampsForDay.length;
                    const offset = currentStampCount * STAMP_OFFSET_PX; // オフセットを計算

                    // 新しいスタンプ画像を作成し、スタンプエリアに追加
                    const img = document.createElement('img');
                    img.src = `${selectedStamp}.png`; 
                    img.style.left = `${offset}px`; // 計算したオフセットを適用
                    img.style.top = `${offset}px`; // topも同じオフセットでずらす
                    img.style.zIndex = currentStampCount + 1; // 新しいスタンプが手前に来るようにz-indexを設定
                    area.appendChild(img);

                    // スタンプ情報を配列に追加 (種類とオフセットをオブジェクトとして保存)
                    stampsForDay.push({ type: selectedStamp, offset: offset });
                    savedStamps[dayId] = stampsForDay;

                    // localStorageに保存
                    localStorage.setItem('stamps', JSON.stringify(savedStamps));
                    console.log(`${dayId} に ${selectedStamp} を押しました！ (合計: ${stampsForDay.length}個, オフセット: ${offset}px)`);
                // } else { // このelseブロックも削除
                //     alert(`この日にはもう${MAX_STAMPS_PER_DAY}回スタンプが押されています！`);
                // }
            } else {
                // スタンプが選択されていない場合はアラートを表示
                alert('押すスタンプを選択してください。');
            }
        });
    });
});
