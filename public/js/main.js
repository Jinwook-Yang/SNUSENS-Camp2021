$(document).ready(async () => {
    $('.addMajorBtn').click(() => {
        $('#addMajorModal').modal('show');
    });

    $('.addBtn').click(() => {
        $('#addModal').modal('show');
    });

    $('.addProfileBtn').click(() => {
        let name = $('.name').val();
        let major = $('.major').val();
        if (!name) {
            alert('이름을 입력해 주세요!!');
            return;
        }
        if (!major) {
            alert('전공을 입력해 주세요!!');
            return;
        }
        $('#addModal').modal('hide');
        $('.name').val('');
        $('.major').val('');
        let bonus = $('.bonus').prop("checked");
        $('.bonus').prop("checked", false);;
        mentorList.push({ name, major, bonus });
        createTable(mentorList, majorSelectList);
    });

    $('.addMajorConfirmBtn').click(() => {
        $('#addMajorModal').modal('hide');
        majorSelectList = $('.majorPicker').val();
        selectNumber = $('.selectNumber').val();
        let resultString = '';
        for (let element of majorSelectList) {
            resultString += element + ', ';
        }
        resultString = resultString.length === 0 ? '없음' : resultString.slice(0, -2);
        $('.targetMajorList').html(`
        <h5 style="text-align: center;  color: darkblue;"><b>학과 전형 목록:</b> ${resultString} / <b>총 선발 인원:</b> ${selectNumber} <h5>
        `);
    });

    $('.startBtn').click(() => {
        alert('추첨을 시작하시겠습니까?');
        resultMentorList = [];
        getMajorMentorlist(mentorList, majorSelectList);
        getRandomMentorlist(mentorList);
    });

    $('.resetBtn').click(() => {
        mentorList = [];
        createTable(mentorList, majorSelectList);
    });
});

const createTable = (mentorList, majorSelectList) => {
    let mentorTableHtml = `
        <table class="table table-hover" style="width:60%; margin-left: 20%">
            <tr style="background-color:lightblue">
                <th style="width:30%">이름<th>
                <th style="width:30%">학부<th>
                <th>수료/1포인트 여부<th>
                <th>삭제<th>
            </tr>
        `
    for (let mentor of mentorList) {
        let isSpecialMajor = majorSelectList.indexOf(mentor.major) === -1 ? '' : ' background-color:lightyellow;';
        let mentorHtml = `
        <tr>
            <th style="width:30%">${mentor.name}<th>
            <th style="width:30%;${isSpecialMajor}">${mentor.major}<th>
            <th style="color: blue;">${mentor.bonus === true ? 'O' : 'X'}<th>
            <th><button type="button" class="btn btn-danger deleteBtn" name="${mentor.name}/${mentor.major}" onclick="deleteRow(this);">삭제</button><th>
        </tr>
        `
        mentorTableHtml += mentorHtml;
    }
    mentorTableHtml += '</table>';
    $('.targetMentorList').html(mentorTableHtml);
}

const alertResult = (result, mentorList, major) => {
    let nameString = !result?.name ? '지원 멘토가 없습니다.' : result.name + ' 멘토';
    alert(`
    ${!!major ? major + ' ' : ''}추첨 결과!!

    ${nameString}`);
    if (!!result?.name) {
        resultMentorList.push(result);
        mentorList.splice(mentorList.indexOf(result), 1);
    }
}


const getMajorMentorlist = (mentorList, majorSelectList) => {
    for (let major of majorSelectList) {
        let result = getSelectedMentor(mentorList.filter(mentor => mentor.major === major));
        alertResult(result, mentorList, major);
    }
}

const getRandomMentorlist = (mentorList) => {
    let currentSelectedAgentLength = resultMentorList.length;
    console.log(mentorList, selectNumber, currentSelectedAgentLength);
    for (let i = 0; i < selectNumber - currentSelectedAgentLength; i++) {
        if (mentorList.length === 0) {
            break;
        }
        let result = getSelectedMentor(mentorList)
        alertResult(result, mentorList, '');
    }
    let resultString = '';
    console.log(resultMentorList);
    for (let i = 0; i < resultMentorList.length; i++) {
        resultString += resultMentorList[i].name + `(${resultMentorList[i].major})` + ', ';
        resultString += (i + 1) % 6 === 0 ? '\n' : '';
    }
    resultString = resultString.slice(0, -2);
    $('.targetMajorList').html(`
        <h3 style="text-align: center; color:red;"><b>합격자 목록:</b><h3>
        <h4 style="text-align: center;"><b>${resultString}</b><h4>
    `);
}

const getSelectedMentor = (majorMentorList) => {
    let targetList = [];
    for (let mentor of majorMentorList) {
        for (let i = 0; i < 5; i++) {
            targetList.push(mentor);
        }
        if (mentor.bonus === true) {
            targetList.push(mentor);
        }
    }
    if (targetList.length === 0) {
        return { name: null };
    }
    return targetList[randomNum(0, targetList.length - 1)];
}

const randomNum = (min, max) => {
    let randNum = Math.floor(Math.random()*(max-min+1)) + min;
    return randNum; 
}