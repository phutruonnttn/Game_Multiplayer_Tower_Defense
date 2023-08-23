-- Toàn bộ thời gian trong config được tính theo millisecond
-- Các thông số có chữ RADIUS là BÁN KÍNH, được tính theo ô trên map

-- Tower

attackAnimationTime là tổng thời gian của 1 animation tấn công
shootAnimationTime là thời gian diên đạn nên bay ra khi thực hiện animation tấn công
2 số trên dùng để có thời gian cho xử lý đồng bộ trên server, fresher có thể không sử dụng nếu có cách xử lý khác

bulletTargetBuffType là loại buff gắn lên quái khi chúng bị trúng đạn (xem tại file TargetBuff.json), mặc định không có là -1
auraTowerBuffType là loại buff gắn lên trụ với các trụ buff xung quanh (xem tại file TowerBuff.json)

-- Monster

Phần multiplier là số nhân cho HP và số lượng quái
Phần monster bao gồm cả quái, boss và minion sinh ra từ kỹ năng boss

ability là loại kỹ năng của boss (xem tại file Ability.json), mặc định không có là -1

-- Ability

Fresher có thể không sử dụng nếu có cách xử lý khác

Chia theo loại kích hoạt: bị trúng đạn "onHit", khi chết "onDead", kích hoạt theo thời gian "periodic" và mất máu "lostHp"
Mỗi loại kích hoạt có thông số kích hoạt khác nhau

-- TowerBuff và TargetBuff

Fresher có thể không sử dụng nếu có cách xử lý khác

durationType có 3 loại: có thời hạn "limited", vô thời hạn "unlimited" và theo khoảng cách di chuyển "moveDistance"

durationUseCardLevel tức là thời gian tăng theo cấp thẻ (10% mỗi cấp), mặc định không có là false
effectsUseCardLevel tức là hiệu ứng tăng theo cấp thẻ (10% mỗi cấp), mặc định không có là false

name trong effects chỉ là tên để dễ phân biệt
type trong effects là loại tác động

state là key cho trạng thái hiển thị của quái / trụ bị ảnh hưởng bởi buff