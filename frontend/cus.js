const BASE_URL = 'http://localhost:8001';
let mode = 'CREATE';
let selectedID = '';

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('ID', id);

    if (id) {
        mode = 'EDIT';
        selectedID = id;
        try {
            const response = await axios.get(`${BASE_URL}/table_member/${id}`);
            const member = response.data;

            document.querySelector('input[name=name_member]').value = member.name_member;
            document.querySelector('input[name=lastname_member]').value = member.lastname_member;
            document.querySelector('input[name=phon]').value = member.phon;
            
            document.querySelectorAll('input[name=gender]').forEach(genderDOM => {
                if (genderDOM.value == member.gender) {
                    genderDOM.checked = true;
                }
            });
        } catch (error) {
            console.log('error', error);
        }
    }
    fetchMembers();
};

const validateData = (userData) => {
    let errors = [];
    if (!userData.name_member) errors.push('กรุณากรอกชื่อ');
    if (!userData.lastname_member) errors.push('กรุณากรอกนามสกุล');
    if (!userData.gender) errors.push('กรุณาเลือกเพศ');
    if (!userData.phon) errors.push('กรุณากรอกเบอร์ติดต่อ');
    return errors;
};

const submitData = async () => {
    let userData = {
        name_member: document.querySelector('input[name=name_member]').value,
        lastname_member: document.querySelector('input[name=lastname_member]').value,
        phon: document.querySelector('input[name=phon]').value,
        gender: document.querySelector('input[name=gender]:checked')?.value || ""
    };

    let errors = validateData(userData);
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }

    try {
        if (mode === 'CREATE') {
            await axios.post(`${BASE_URL}/table_member`, userData);
        } else {
            await axios.put(`${BASE_URL}/table_member/${selectedID}`, userData);
        }
        alert(mode === 'CREATE' ? 'บันทึกข้อมูลสำเร็จ' : 'แก้ไขข้อมูลสำเร็จ');
        window.location.reload();
    } catch (error) {
        console.log('error', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
};
function searchMember() {
    let keyword = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#member-list tr");

    rows.forEach(row => {
        let name = row.cells[0].textContent.toLowerCase();
        row.style.display = name.includes(keyword) ? "" : "none";
    });
}


const fetchMembers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/table_member`);
        const members = response.data;
        const memberList = document.getElementById('member-list');
        memberList.innerHTML = '';
        
        members.forEach(member => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.name_member} ${member.lastname_member}</td>
                <td>${member.gender}</td>
                <td>${member.phon}</td>
                <td><button class="delete-btn" onclick="deleteMember(${member.id})">ลบ</button></td>
            `;
            memberList.appendChild(row);
        });
    } catch (error) {
        console.log('error', error);
    }
};

const deleteMember = async (id) => {
    if (!confirm('คุณต้องการลบสมาชิกนี้ใช่หรือไม่?')) return;
    try {
        await axios.delete(`${BASE_URL}/table_member/${id}`);
        alert('ลบข้อมูลสำเร็จ');
        fetchMembers();
    } catch (error) {
        console.log('error', error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
};