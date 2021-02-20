USE master
Create database QLMayLanh	
GO

USE QLMayLanh
GO 

Create Table NhanVien
(
	ID int Identity(1,1) Primary key,
	Username nvarchar(max) not null,
	Password nvarchar(max) not null,
	TenKTV nvarchar(max) not null,
	SDT varchar(10),
	Loai int, --0: admin, 1: qlkho, 2: qlnhaplieu, 3: ktv 
	Status int, --0: khóa, 1: sử dụng, 2: xóa
)
GO

Create Table KhachHang
(
	ID int Identity(1,1) Primary key,
	HoTen nvarchar(max) not null,
	SDT varchar(10) not null,
	DiaChi nvarchar(max),
	NgayPhucVu date,
	Loai bit,
	Status bit,
)
GO

Create Table MayLanh
(
	ID int Identity(1,1) Primary key,
	IDKhachHang int not null,
	IDDichVu nvarchar(100),
	Ma nvarchar(10),
	TenMay nvarchar(max),
	Model nvarchar(max),
	CongSuat nvarchar(max),
	NgayMua date,
	ViTri nvarchar(max),
	GhiChu nvarchar(max),
	Status int,

	foreign key(IDKhachHang) references KhachHang(ID)
)
GO

Create Table DichVu_SanPham
(
	ID int Identity(1,1) Primary key,
	MaDV_SP nvarchar(100) not null,
	TenDichVu_SanPham nvarchar(max),
	Loai bit,
	DonGia float default 0,
	Diem float default 0,
	NgayApDung date,
	Status bit,
)
GO

Create Table YeuCauPhucVu
(
	ID int Identity(1,1) Primary key,
	IDKhachHang int not null,
	DiaChiPhucVu nvarchar(max),
	Loai int,
	YeuCau nvarchar(max),
	NgayLap date,
	NgayBatDau date,
	NgayLamTiep date,
	NgayDuKienTra date,
	NgayHoanThanh date,
	LiDo nvarchar(max),
	GhiChu nvarchar(max),
	SoNgay int,
	Status int,

	foreign key(IDKhachHang) references KhachHang(ID)
)
GO

--Create Table YeuCau_MayPhucVu
--(
--	ID int Identity(1,1) Primary key,
--	IDYC int not null,
--	IDMay int not null,
--	IDUser int not null,
--	NgayLam date,
--	GhiChu nvarchar(max),

--	foreign key(IDYC) references YeuCauPhucVu(ID),
--	foreign key(IDMay) references MayPhucVu(ID),
--	foreign key(IDUser) references NhanVien(ID),
--)
--GO

Create Table BienBanNghiemThu
(
	ID int Identity(1,1) Primary key,
	IDYC int not null,
	Ma bigint,
	NgayLap date,
	DoanhThu float default 0,
	Diem float default 0,
	GhiChu nvarchar(max),
	Status bit,

	foreign key(IDYC) references YeuCauPhucVu(ID),
)
GO

Create Table KTV_BBNT 
(
	ID int Identity(1,1) primary key,
	IDBBNT int not null,
	IDUser int not null,
	Diem float default 0,
	DanhGia nvarchar(max),
	Status bit,

	foreign key(IDUser) references NhanVien(ID),
	foreign key(IDBBNT) references BienBanNghiemThu(ID),
)
GO

Create table ChiPhiKhac
(
	ID int Identity(1,1) primary key,
	IDYCPV int not null,
	TenChiPhi nvarchar(max),
	SoLuong int,
	DonGia float default 0,
	GhiChu nvarchar(max),
	Status bit,

	foreign key(IDYCPV) references YeuCauPhucVu(ID),
)


Create Table CTBienBanNghiemThu
(
	ID int Identity(1,1) Primary key,
	IDBBNT int not null,
	IDDichVu int not null,
	DonGia int,
	Diem float default 0,
	MayLanh nvarchar(max),
	SoLuong int,
	GhiChu nvarchar(max),

	foreign key(IDBBNT) references BienBanNghiemThu(ID),
	foreign key(IDDichVu) references DichVu_SanPham(ID),
)
GO

Create Table CTBBNT_MayLanh
(
	ID int Identity(1,1) Primary key,
	IDCTBBNT int not null,
	IDMay int not null,
	Status bit,

	foreign key(IDCTBBNT) references CTBienBanNghiemThu(ID),
	foreign key(IDMay) references MayLanh(ID),
)
GO

Create Table KhoVatDung
(
	ID int Identity(1,1) Primary key,
	TenVatDung nvarchar(max),
	NgayMua date,
	GhiChu nvarchar(max),
	Status int,
)
GO

Create Table PhieuXuatKho
(
	ID int Identity(1,1) Primary key,
	IDKTV int not null,
	NgayXuat datetime,
	NgayTra datetime,
	Status int,
	foreign key(IDKTV) references NhanVien(ID),
)
GO

Create Table CTPhieuXuatKho
(
	ID int Identity(1,1) Primary key,
	IDPhieuXuat int not null,
	IDVatDung int not null,
	Status int,
	foreign key(IDPhieuXuat) references PhieuXuatKho(ID),
	foreign key(IDVatDung) references KhoVatDung(ID),
)
GO

Create Table VatTu
(
	ID int Identity(1,1) Primary key,
	TenVatTu nvarchar(max),
	SoLuong float default 0,
	DonVi nvarchar(max),
	GiaBan float default 0,
	GhiChu nvarchar(max),
	Status int,
)
GO

Create Table PhieuNhapVatTu
(
	ID int Identity(1,1) Primary key,
	NgayNhap date,
	GhiChu nvarchar(max),
	Status int,
)
GO

Create Table CTPhieuNhapVatTu
(
	ID int Identity(1,1) Primary key,
	IDPhieuNhap int not null,
	IDVatTu int not null,
	SoLuong float default 0,
	DonGia float default 0,
	NCC nvarchar(max),
	GhiChu nvarchar(max),
	Status int,

	foreign key(IDPhieuNhap) references PhieuNhapVatTu(ID),
	foreign key(IDVatTu) references VatTu(ID),
)
GO

Create Table PhieuXuatVatTu_KTV
(
	ID int Identity(1,1) Primary key,
	NgayXuat date,
	IDKTV int not null,
	IDYeuCauPV int not null,
	GhiChu nvarchar(max),
	Status int,

	foreign key(IDKTV) references NhanVien(ID),
	foreign key(IDYeuCauPV) references YeuCauPhucVu(ID),
)
GO

Create Table CTPhieuXuatVatTu_KTV
(
	ID int Identity(1,1) Primary key,
	IDPX_KTV int not null,
	IDVatTu int not null,
	SLLay float default 0,
	SLTra float default 0,
	SLThucTe float default 0,
	DonGia float default 0,
	Status int,

	foreign key(IDPX_KTV) references PhieuXuatVatTu_KTV(ID),
	foreign key(IDVatTu) references VatTu(ID),
)
GO

Create Table PhieuXuatVatTu_Khach
(
	ID int Identity(1,1) Primary key,
	NgayXuat date,
	TenKhach nvarchar(max),
	GhiChu nvarchar(max),
	Status int,
)
GO

Create Table CTPhieuXuatVatTu_Khach
(
	IDPX_Khach int not null,
	IDVatTu int not null,
	SoLuong float default 0,
	DonGia float default 0,
	Status int,

	primary key(IDPX_Khach,IDVatTu),
	foreign key(IDPX_Khach) references PhieuXuatVatTu_Khach(ID),
	foreign key(IDVatTu) references VatTu(ID),
)
GO

Create Procedure Acc_Login
	@username varchar(100),
	@password varchar(100)
as
Begin
	declare @count int
	declare @flag bit
	select @count = count(*) from NhanVien where Username=@username and Password=@password
	if(@count > 0)
		set @flag = 1
	else
		set @flag = 0
	select @flag
end
GO

