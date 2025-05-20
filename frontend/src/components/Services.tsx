import React from 'react';
import { useNavigate } from 'react-router-dom';

// Bộ icons chuyên nghiệp thay vì emoji
const ServiceIcon = ({ name }: { name: string }) => {
  switch (name) {
    case 'consultation':
      return (
        <svg className="w-10 h-10 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
        </svg>
      );
    case 'diagnosis':
      return (
        <svg className="w-10 h-10 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
        </svg>
      );
    case 'hormone':
      return (
        <svg className="w-10 h-10 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd"></path>
        </svg>
      );
    case 'ivf':
      return (
        <svg className="w-10 h-10 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
        </svg>
      );
    case 'iui':
      return (
        <svg className="w-10 h-10 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
        </svg>
      );
    case 'psychological':
      return (
        <svg className="w-10 h-10 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
        </svg>
      );
    case 'std':
      return (
        <svg className="w-10 h-10 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      );
    default:
      return (
        <svg className="w-10 h-10 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd"></path>
          <path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11zm8.921 2.012a1 1 0 01.831 1.145 19.86 19.86 0 01-.545 2.436 1 1 0 11-1.92-.558c.207-.713.371-1.445.49-2.192a1 1 0 011.144-.83z" clipRule="evenodd"></path>
        </svg>
      );
  }
};

const Services: React.FC = () => {
  const navigate = useNavigate();

  const handleAppointment = (service: string = '') => {
    if (service) {
      navigate(`/appointment?service=${encodeURIComponent(service)}`);
    } else {
      navigate('/appointment');
    }
  };
  const services = [
    {
      id: 1,
      title: 'Tư Vấn Vô Sinh - Hiếm Muộn',
      description: 'Đội ngũ chuyên gia giàu kinh nghiệm tư vấn toàn diện về các vấn đề vô sinh và giải pháp phù hợp.',
      icon: 'consultation',
      features: [
        'Tư vấn trực tiếp với bác sĩ chuyên khoa',
        'Đánh giá chi tiết nguyên nhân vô sinh',
        'Giải thích các phương pháp điều trị',
        'Lập kế hoạch điều trị cá nhân hóa',
        'Hỗ trợ tâm lý trong quá trình điều trị'
      ]
    },
    {
      id: 2,
      title: 'Khám và Chẩn Đoán Hiếm Muộn',
      description: 'Thăm khám toàn diện, sử dụng các xét nghiệm và công nghệ tiên tiến để xác định chính xác nguyên nhân.',
      icon: 'diagnosis',
      features: [
        'Khám tổng quát hệ sinh sản',
        'Xét nghiệm nội tiết tố sinh sản',
        'Phân tích chất lượng tinh trùng',
        'Siêu âm theo dõi nang trứng',
        'Nội soi chẩn đoán các bất thường'
      ]
    },
    {
      id: 3,
      title: 'Điều Trị Nội Tiết Sinh Sản',
      description: 'Điều chỉnh các rối loạn nội tiết ảnh hưởng đến khả năng sinh sản bằng phương pháp tiên tiến.',
      icon: 'hormone',
      features: [
        'Điều trị rối loạn phóng noãn',
        'Điều trị hội chứng buồng trứng đa nang',
        'Điều chỉnh nội tiết tố nam/nữ',
        'Theo dõi sát sao đáp ứng điều trị',
        'Điều trị vô sinh do suy giảm nội tiết'
      ]
    },
    {
      id: 4,
      title: 'Thụ Tinh Trong Ống Nghiệm (IVF)',
      description: 'Công nghệ IVF hiện đại với tỷ lệ thành công cao, được thực hiện bởi các chuyên gia hàng đầu.',
      icon: 'ivf',
      features: [
        'Kích thích buồng trứng',
        'Thu nhận trứng chất lượng cao',
        'Thụ tinh trong phòng thí nghiệm',
        'Nuôi cấy phôi trong điều kiện tối ưu',
        'Chuyển phôi và hỗ trợ làm tổ'
      ]
    },
    {
      id: 5,
      title: 'Bơm Tinh Trùng Vào Buồng Tử Cung (IUI)',
      description: 'Phương pháp hỗ trợ sinh sản đơn giản, phù hợp với nhiều trường hợp vô sinh nhẹ và vừa.',
      icon: 'iui',
      features: [
        'Xử lý và chuẩn bị tinh trùng',
        'Theo dõi thời điểm rụng trứng tối ưu',
        'Thực hiện bơm tinh trùng nhẹ nhàng',
        'Chi phí hợp lý, ít can thiệp',
        'Phù hợp với vô sinh do yếu tố cổ tử cung'
      ]
    },
    {
      id: 6,
      title: 'Hỗ Trợ Tâm Lý Điều Trị Hiếm Muộn',
      description: 'Đồng hành cùng các cặp vợ chồng trong hành trình điều trị với sự hỗ trợ tâm lý chuyên nghiệp.',
      icon: 'psychological',
      features: [
        'Tư vấn tâm lý cá nhân và cặp đôi',
        'Quản lý stress và lo âu',
        'Hỗ trợ đối phó với thất bại điều trị',
        'Nhóm hỗ trợ chia sẻ kinh nghiệm',
        'Trang bị kỹ năng tâm lý trong quá trình điều trị dài hạn'
      ]
    },
    {
      id: 7,
      title: 'Xét Nghiệm Bệnh Lây Truyền Qua Đường Tình Dục',
      description: 'Dịch vụ kiểm tra và chẩn đoán toàn diện các bệnh lây truyền tình dục, đảm bảo riêng tư và kết quả chính xác.',
      icon: 'std',
      features: [
        'Xét nghiệm sàng lọc STD toàn diện',
        'Xét nghiệm HIV, viêm gan B/C, giang mai, chlamydia...',
        'Tư vấn bảo mật và riêng tư tuyệt đối',
        'Kết quả xét nghiệm nhanh và chính xác',
        'Tư vấn phòng ngừa và điều trị khi cần thiết'
      ]
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-blue-900 mb-2">
            Dịch Vụ Điều Trị Hiếm Muộn
          </h1>
          <div className="w-40 h-1 bg-blue-800 mx-auto my-4"></div>
          <p className="mt-6 text-lg text-gray-700 max-w-3xl mx-auto font-light leading-relaxed">
            Đội ngũ chuyên gia của chúng tôi sẽ đồng hành cùng bạn trên hành trình hiện thực hóa ước mơ làm cha mẹ 
            với các dịch vụ y tế chuyên biệt, công nghệ hiện đại và phác đồ điều trị cá nhân hóa.
          </p>
        </div>

        <div className="mt-20 grid gap-y-12 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ServiceIcon name={service.icon} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-blue-900">{service.title}</h3>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>

                <div className="mt-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-3">Dịch vụ bao gồm</h4>
                  <ul className="space-y-3">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-blue-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-3 text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={() => handleAppointment(service.title)}
                  className="w-full flex justify-center py-2.5 px-4 border border-blue-800 rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors duration-200"
                >
                  Đặt lịch tư vấn
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="max-w-2xl mx-auto bg-blue-50 p-8 rounded-lg border border-blue-100">
            <h3 className="text-xl font-medium text-blue-900 mb-4">Đặt lịch tư vấn với chuyên gia</h3>
            <p className="text-gray-600 mb-6">
              Mỗi trường hợp hiếm muộn đều có những đặc thù riêng. Chúng tôi cam kết tôn trọng sự riêng tư và
              cung cấp giải pháp tối ưu cho từng bệnh nhân.
            </p>
            <button 
              onClick={() => handleAppointment()}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors duration-200"
            >
              Liên hệ tư vấn miễn phí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 