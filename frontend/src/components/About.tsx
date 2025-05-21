import React, { useState } from 'react';

const About: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: '',
        description: '',
        image: ''
    });

    const openModal = (title: string, description: string, image: string = '') => {
        setModalContent({ title, description, image });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    // Thông tin chi tiết cho các nút
    const statsInfo = [
        {
            title: "Đội ngũ y tế",
            description: "Trung tâm có hơn 50 chuyên gia y tế hàng đầu, bao gồm bác sĩ sản phụ khoa, chuyên gia phôi học, nhà di truyền học, và chuyên viên xét nghiệm. Đội ngũ của chúng tôi được đào tạo tại các cơ sở y tế hàng đầu trong và ngoài nước, và liên tục cập nhật kiến thức thông qua các hội nghị và khóa đào tạo quốc tế.",
            image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1974&auto=format&fit=crop"
        },
        {
            title: "Ca điều trị thành công",
            description: "Với hơn 5.000 ca điều trị thành công, chúng tôi tự hào về tỷ lệ thành công cao nhất khu vực. Mỗi năm, trung tâm chúng tôi giúp đỡ hơn 500 gia đình có được niềm vui làm cha mẹ thông qua các phương pháp điều trị hiện đại và hiệu quả nhất.",
            image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Kinh nghiệm phục vụ",
            description: "Với hơn 15 năm kinh nghiệm, Trung tâm Y tế Tinh Trùng Chill là một trong những đơn vị tiên phong trong lĩnh vực y học sinh sản tại Việt Nam. Chúng tôi không ngừng cải tiến và áp dụng những công nghệ mới nhất trong điều trị vô sinh hiếm muộn.",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    const servicesInfo = [
        {
            title: "Thụ tinh trong ống nghiệm (IVF)",
            description: "Quy trình thụ tinh ống nghiệm của chúng tôi bao gồm các bước: kích thích buồng trứng, lấy trứng, lấy tinh trùng, thụ tinh trong phòng thí nghiệm, nuôi cấy phôi và chuyển phôi vào tử cung. Chúng tôi sử dụng công nghệ tiên tiến như ICSI (tiêm tinh trùng vào bào tương trứng), PGT (xét nghiệm di truyền tiền làm tổ) và ERA (phân tích độ thoải mái nội mạc tử cung) để tối ưu hóa kết quả điều trị.",
            image: "https://img.freepik.com/free-photo/embryologist-ivf-laboratory-working-with-test-tubes-petri-dishes-research_1303-29732.jpg"
        },
        {
            title: "Đánh giá khả năng sinh sản",
            description: "Quy trình đánh giá toàn diện bao gồm: khám lâm sàng, xét nghiệm hormone, kiểm tra khả năng phóng noãn, đánh giá tử cung và vòi trứng, phân tích tinh dịch đồ, và các xét nghiệm chuyên sâu khác. Chúng tôi sử dụng các phương pháp chẩn đoán tiên tiến để xác định chính xác nguyên nhân vô sinh và đề xuất phương pháp điều trị phù hợp.",
            image: "https://img.freepik.com/free-photo/specialist-medical-uniform-examining-woman-hospital_1303-25514.jpg"
        },
        {
            title: "Phân tích và điều trị tinh trùng",
            description: "Chúng tôi sử dụng công nghệ phân tích tinh trùng CASA (Computer-Aided Sperm Analysis), kỹ thuật MACS (Magnetic-Activated Cell Sorting) và IMSI (Intracytoplasmic Morphologically Selected Sperm Injection) để đánh giá chính xác và lựa chọn tinh trùng chất lượng cao. Các phương pháp điều trị bao gồm liệu pháp hormone, điều trị thuốc kháng sinh, phẫu thuật điều trị giãn tĩnh mạch thừng tinh và các kỹ thuật trích xuất tinh trùng như TESE, PESA và MESA.",
            image: "https://img.freepik.com/free-photo/laboratory-microscope-with-digital-tablet-desk_1262-4464.jpg"
        },
        {
            title: "Xét nghiệm và tư vấn di truyền",
            description: "Chúng tôi cung cấp các xét nghiệm di truyền toàn diện bao gồm: xét nghiệm nhiễm sắc thể, xét nghiệm đột biến gen đơn, xét nghiệm PGT-A (kiểm tra bất thường nhiễm sắc thể), PGT-M (kiểm tra đột biến đơn gen) và PGT-SR (kiểm tra bất thường cấu trúc nhiễm sắc thể). Đội ngũ chuyên gia di truyền của chúng tôi cung cấp tư vấn toàn diện về các vấn đề di truyền và các lựa chọn điều trị phù hợp.",
            image: "https://img.freepik.com/free-photo/scientist-looking-dna-samples-laboratory_23-2148876687.jpg"
        }
    ];

    const facilitiesInfo = [
        {
            title: "Phòng thí nghiệm hiện đại",
            description: "Phòng thí nghiệm của chúng tôi được trang bị hệ thống kiểm soát môi trường tiên tiến, tủ cấy vô trùng class II, hệ thống nuôi cấy phôi Time-lapse, hệ thống đông lạnh phôi và tinh trùng vitrification, và kính hiển vi ICSI/IMSI tiên tiến. Tất cả các thiết bị đều đạt tiêu chuẩn quốc tế và được bảo trì thường xuyên.",
            image: "https://img.freepik.com/free-photo/modern-equipped-laboratory_144627-25526.jpg"
        },
        {
            title: "Phòng tư vấn",
            description: "Phòng tư vấn được thiết kế tạo không gian ấm cúng và riêng tư, giúp bệnh nhân cảm thấy thoải mái khi chia sẻ thông tin. Mỗi phòng được trang bị hệ thống hiển thị đa phương tiện để bác sĩ có thể giải thích dễ dàng các quy trình và kết quả xét nghiệm cho bệnh nhân.",
            image: "https://img.freepik.com/free-photo/beautiful-doctor-office-hospital_23-2149326973.jpg"
        },
        {
            title: "Phòng điều trị",
            description: "Phòng điều trị và phẫu thuật được trang bị hệ thống điều hòa không khí HEPA filtered, đèn mổ LED không tạo bóng, hệ thống siêu âm 4D, thiết bị gây mê và theo dõi bệnh nhân tiên tiến. Các thiết bị này đảm bảo độ chính xác cao trong quá trình can thiệp và an toàn tối đa cho bệnh nhân.",
            image: "https://img.freepik.com/free-photo/interior-view-operating-room_1170-2254.jpg"
        },
        {
            title: "Khu vực chờ",
            description: "Khu vực chờ được thiết kế tạo cảm giác thoải mái với ghế sofa êm ái, ánh sáng tự nhiên, và không gian xanh. Chúng tôi cung cấp Wi-Fi miễn phí, nước uống, và các tạp chí thông tin về sức khỏe sinh sản. Khu vực này cũng có không gian riêng cho các cặp đôi muốn có sự riêng tư.",
            image: "https://img.freepik.com/free-photo/empty-waiting-room-with-chairs-office_23-2148857793.jpg"
        }
    ];

    return (
        <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-blue-900 mb-6">Về Trung Tâm Y Tế Tinh Trùng Chill</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Nơi mang lại hy vọng và hạnh phúc cho hàng nghìn gia đình Việt Nam
                    </p>
                </div>

                {/* Introduction with Image */}
                <div className="flex flex-col md:flex-row gap-12 items-center mb-16 bg-blue-50 rounded-2xl p-8 shadow-sm">
                    <div className="md:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2073&auto=format&fit=crop"
                            alt="Trung tâm Y tế"
                            className="rounded-xl shadow-lg w-full h-auto object-cover"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-blue-800 mb-6">Sứ Mệnh Của Chúng Tôi</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Tại Trung Tâm Y Tế Tinh Trùng Chill, chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe sinh sản
                            toàn diện, chu đáo và tiên tiến cho các cá nhân và cặp đôi đang gặp khó khăn về khả năng sinh sản.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Sứ mệnh của chúng tôi là giúp các gia đình phát triển thông qua các công nghệ sinh sản tiên tiến,
                            đồng thời duy trì tiêu chuẩn cao nhất về chất lượng y tế và chăm sóc bệnh nhân.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {statsInfo.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-8 shadow-md text-center border-t-4 border-blue-600 hover:shadow-xl transition-shadow cursor-pointer"
                            onClick={() => openModal(stat.title, stat.description, stat.image)}
                        >
                            <div className="text-blue-600 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                    {index === 0 && <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>}
                                    {index === 1 && <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>}
                                    {index === 2 && <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>}
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {index === 0 && "50+"}
                                {index === 1 && "5.000+"}
                                {index === 2 && "15+"}
                            </h3>
                            <p className="text-gray-600">{stat.title}</p>
                            <p className="text-blue-600 mt-2 text-sm">Nhấp để xem chi tiết</p>
                        </div>
                    ))}
                </div>

                {/* Our Services with Images */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Dịch Vụ Chuyên Môn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {servicesInfo.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                                onClick={() => openModal(service.title, service.description, service.image)}
                            >
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                                    <p className="text-gray-600 line-clamp-3">
                                        {service.description.substring(0, 120)}...
                                    </p>
                                    <p className="text-blue-600 mt-2">Nhấp để xem chi tiết</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Our Approach */}
                <div className="flex flex-col md:flex-row gap-12 items-center mb-16 bg-blue-50 rounded-2xl p-8 shadow-sm">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-blue-800 mb-6">Phương Pháp Tiếp Cận</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Chúng tôi tin vào phương pháp tiếp cận toàn diện đối với chăm sóc sức khỏe sinh sản.
                            Đội ngũ chuyên gia giàu kinh nghiệm kết hợp chuyên môn y tế với hỗ trợ tâm lý để
                            đồng hành cùng bạn trong hành trình sinh sản.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Chúng tôi hiểu rằng tình hình của mỗi bệnh nhân là độc đáo, và chúng tôi phát triển
                            kế hoạch điều trị cá nhân hóa đáp ứng nhu cầu và mục tiêu cụ thể của bạn.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <img
                            src="https://img.freepik.com/free-photo/professional-medical-team-working-with-female-patient-hospital-office_1303-21203.jpg"
                            alt="Tư vấn bệnh nhân"
                            className="rounded-xl shadow-lg w-full h-auto object-cover"
                        />
                    </div>
                </div>

                {/* Facilities with Grid Images */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Cơ Sở Vật Chất Hiện Đại</h2>
                    <p className="text-gray-700 text-center max-w-4xl mx-auto mb-8">
                        Trung tâm của chúng tôi được trang bị công nghệ và cơ sở vật chất hiện đại nhất để cung cấp
                        dịch vụ chăm sóc chất lượng cao nhất. Từ thiết bị phòng thí nghiệm tiên tiến đến không gian
                        bệnh nhân thoải mái, chúng tôi đảm bảo rằng mọi khía cạnh của quá trình điều trị đều được
                        thực hiện trong môi trường an toàn, hỗ trợ và công nghệ cao.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {facilitiesInfo.map((facility, index) => (
                            <div
                                key={index}
                                className="relative group cursor-pointer"
                                onClick={() => openModal(facility.title, facility.description, facility.image)}
                            >
                                <img
                                    src={facility.image}
                                    alt={facility.title}
                                    className="rounded-lg shadow-md group-hover:shadow-lg transition-shadow h-56 w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300 rounded-lg">
                                    <p className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
                                        {facility.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Testimonials */}
                <div className="bg-blue-50 rounded-2xl p-8 shadow-sm mb-16">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Chia Sẻ Từ Khách Hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex items-center mb-4">
                                <img
                                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
                                    alt="Khách hàng"
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-800">Nguyễn Thị Minh</h4>
                                    <p className="text-gray-500 text-sm">Khách hàng IVF</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "Sau 5 năm chờ đợi, cuối cùng chúng tôi đã có em bé nhờ sự hỗ trợ của Trung tâm.
                                Đội ngũ y bác sĩ không chỉ chuyên nghiệp mà còn vô cùng tâm lý, luôn đồng hành và
                                động viên chúng tôi trong suốt quá trình điều trị."
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex items-center mb-4">
                                <img
                                    src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1974&auto=format&fit=crop"
                                    alt="Khách hàng"
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-800">Trần Văn Hùng & Lê Thị Hoa</h4>
                                    <p className="text-gray-500 text-sm">Điều trị vô sinh</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "Chúng tôi đã thử nhiều nơi nhưng chỉ khi đến với Trung tâm Y tế Tinh Trùng Chill,
                                chúng tôi mới thực sự cảm thấy có hy vọng. Phương pháp điều trị cá nhân hóa và sự
                                tận tâm của các bác sĩ đã giúp chúng tôi đạt được điều tưởng chừng như không thể."
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-blue-800 mb-6">Hãy Đồng Hành Cùng Chúng Tôi</h2>
                    <p className="text-gray-700 max-w-3xl mx-auto mb-8">
                        Chúng tôi cam kết cung cấp dịch vụ chăm sóc minh bạch, đạo đức và tập trung vào bệnh nhân.
                        Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn trong suốt hành trình sinh sản, mang lại hy vọng
                        và hạnh phúc cho gia đình bạn.
                    </p>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-blue-800">{modalContent.title}</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        {modalContent.image && (
                            <img
                                src={modalContent.image}
                                alt={modalContent.title}
                                className="w-full h-auto rounded-lg mb-4"
                            />
                        )}
                        <p className="text-gray-700 leading-relaxed">{modalContent.description}</p>
                        <button
                            onClick={closeModal}
                            className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors w-full"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default About; 