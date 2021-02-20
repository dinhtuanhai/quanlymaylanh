using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ASP_MVC.EF;
using System.Web.Mvc;
using System.Web.UI;
using ASP_MVC.Areas.admin.Models;
using System.Web.Script.Serialization;
using System.Globalization;

namespace ASP_MVC.Areas.admin.Controllers
{
    [Authorize(Roles = "0,2")]
    public class BienBanNghiemThuController : Controller
    {
        // GET: admin/BienBanNghiemThu
        private QLMayLanhEntities db = new QLMayLanhEntities();
        public ActionResult Index(long stt, long kh)
        {
            var ycpv = db.YeuCauPhucVus.Find(stt);
            if(ycpv.Status ==  3)
            {
                ViewBag.Hidden = true;
            }
            else
                ViewBag.Hidden = false;
            List<BienBanNghiemThu> list = db.BienBanNghiemThus.Where(x => x.IDYC == stt && x.Status == true).ToList();
            List<CTBienBanNghiemThu> listct = db.CTBienBanNghiemThus.Where(x => x.BienBanNghiemThu.IDYC == stt).ToList();
            if (list.Count > 0 && listct.Count > 0)
            {
                for (int i = 0; i < list.Count; i++)
                {
                    list[i].DoanhThu = listct.Where(x=>x.IDBBNT == list[i].ID).Sum(x => x.DonGia.Value * x.SoLuong.Value);
                    list[i].Diem = listct.Where(x => x.IDBBNT == list[i].ID).Sum(x => x.Diem.Value * x.SoLuong.Value);
                    BienBanNghiemThu bbnt = db.BienBanNghiemThus.Find(list[i].ID);
                    bbnt.DoanhThu = list[i].DoanhThu;
                    bbnt.Diem = list[i].Diem;
                    db.SaveChanges();
                }
                //ViewBag.BBNT = list;

            }
            ViewBag.IDKH = kh;
            ViewBag.KH = db.KhachHangs.Find(kh);
            ViewBag.IDYC = stt;
            ViewBag.KTV = db.NhanViens.Where(x => x.Loai != 0 && x.Status == 1).ToList();
            ViewBag.BBNT = db.BienBanNghiemThus.Where(x => x.IDYC == stt && x.Status == true).ToList();
            var rs = db.CTBienBanNghiemThus.Where(x => x.BienBanNghiemThu.IDYC == stt).ToList();
            return View(rs);
        }
        public void setViewBag(long kh)
        {
            List<DichVu_SanPham> dv_sp = db.DichVu_SanPham.Where(x => x.Status == true).ToList();
            ViewBag.IDDichVu = dv_sp;
            
            ViewBag.KH = db.KhachHangs.Find(kh);
        }

        public ActionResult ThemBBNT(long stt, long kh)
        {
            var ycpv = db.YeuCauPhucVus.Find(stt);
            if (ycpv.SoNgay == null)
            {
                ycpv.SoNgay = 1;
                db.SaveChanges();
            }
            else
            {
                ycpv.SoNgay += 1;
                db.SaveChanges();
            }
            BienBanNghiemThuModel bbnt = new BienBanNghiemThuModel();
            bbnt.ThemBBNT((int)stt);
            return RedirectToAction("Index","BienBanNghiemThu", new {stt,kh});
        }

        [HttpPost]
        public JsonResult timDV(string madv)
        {
            var rs = db.DichVu_SanPham.SingleOrDefault(x=>x.MaDV_SP.Equals(madv) && x.Status==true);
            return Json(new { status=true });
        }

        [HttpGet]
        public ActionResult Create(long stt, long kh)
        {
            //long id = long.Parse(Request.QueryString["kh"].ToString());
            var ycpv = db.YeuCauPhucVus.Find(stt);
            var dvsp = db.DichVu_SanPham.Where(x=>x.Status==true).ToList().Select(d=> new {
                ID= d.ID,
                Text= d.MaDV_SP + ". " + d.TenDichVu_SanPham
            });
            ViewBag.IDBBNT = int.Parse(RouteData.Values["id"].ToString());
            ViewBag.IDKH = kh;
            ViewBag.IDYC = stt;//long.Parse(Request.QueryString["stt"].ToString());
            ViewBag.DVSP = new SelectList(dvsp, "ID", "Text");
            
            if (ycpv.Loai == 2)
            {
                ViewBag.DSMayPhucVu = db.MayLanhs.Where(x => x.IDKhachHang == 1 && x.Status == 1).ToList();
            }
            else
                ViewBag.DSMayPhucVu = db.MayLanhs.Where(x => x.IDKhachHang == kh && x.Status == 1).ToList();
            setViewBag(kh);
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(CTBienBanNghiemThu ct)
        {
            BienBanNghiemThuModel bbnt = new BienBanNghiemThuModel();
            DichVu_SanPhamModel dvsp = new DichVu_SanPhamModel();
            long idkh = long.Parse(Request.QueryString["kh"].ToString());
            ViewBag.IDKH = idkh;
            long idyc = long.Parse(Request.QueryString["stt"].ToString());
            ViewBag.IDYC = idyc;
            int idbbnt = int.Parse(RouteData.Values["id"].ToString());
            if (ModelState.IsValid)
            {
                ct.IDBBNT = idbbnt;
                db.CTBienBanNghiemThus.Add(ct);
                db.SaveChanges();
                //return RedirectToAction("Index", new { stt = idyc, kh = idkh });
            }
            setViewBag(idkh);
            return View(ct);
        }

        [HttpPost]
        public JsonResult NewDVSP(string dvsp)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            DichVu_SanPham dvspnew = serializer.Deserialize<DichVu_SanPham>(dvsp);

            var rs = db.DichVu_SanPham.SingleOrDefault(x => x.MaDV_SP.Equals(dvspnew.MaDV_SP) && x.Status == true);
            if(rs == null)
            {
                if (dvspnew.DonGia > 0 && dvspnew.Diem > 0)
                {
                    dvspnew.Status = true;
                    dvspnew.NgayApDung = DateTime.Now;
                    db.DichVu_SanPham.Add(dvspnew);
                    db.SaveChanges();
                    return Json(new { status = true, mess = "Thêm thành công",ma=dvspnew.MaDV_SP, ten = dvspnew.TenDichVu_SanPham },JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { status = false, mess = "Đơn giá và điểm không được để trống và phải > 0" });
            }
            return Json(new {status = false, mess="Mã đã tồn tại" });
        }
        public JsonResult Success(long idyc)
        {
            var ycpv = db.YeuCauPhucVus.Find(idyc);
            if(ycpv.Loai == 2)
            {
                List<CTBBNT_MayLanh> ct = db.CTBBNT_MayLanh.Where(x => x.CTBienBanNghiemThu.BienBanNghiemThu.IDYC == idyc).ToList();
                foreach (CTBBNT_MayLanh item in ct)
                {
                    var may = db.MayLanhs.SingleOrDefault(x => x.ID == item.IDMay);
                    may.Status = 1;
                    db.SaveChanges();
                }

            }
            ycpv.Status = 3;
            ycpv.NgayHoanThanh = DateTime.Now.Date;
            db.SaveChanges();
            return Json(new
            {
                status = true
            });
        }

        public JsonResult XoaCT(long idct)
        {
            
            var ct = db.CTBienBanNghiemThus.Find(idct);
            BienBanNghiemThu bbnt = db.BienBanNghiemThus.Find(ct.IDBBNT);
            bbnt.DoanhThu -= ct.DonGia.Value*ct.SoLuong.Value;
            bbnt.Diem -= ct.Diem.Value*ct.SoLuong.Value;
            YeuCauPhucVu yc = db.YeuCauPhucVus.Single(x => x.ID == bbnt.IDYC);
            List<CTBBNT_MayLanh> list = db.CTBBNT_MayLanh.Where(x => x.IDCTBBNT == ct.ID).ToList();
            foreach (CTBBNT_MayLanh ctml in list)
            {
                if (yc.Loai == 2)
                    ctml.MayLanh.Status = 1;
                db.CTBBNT_MayLanh.Remove(ctml);
            }
            db.CTBienBanNghiemThus.Remove(ct);
            db.SaveChanges();
            return Json(new
            {
                status = true
            });
        }

        [HttpPost]
        public JsonResult XoaBBNT(long idbbnt)
        {
            var bbnt = db.BienBanNghiemThus.Find(idbbnt);
            bbnt.Status = false;
            var ycpv = db.YeuCauPhucVus.SingleOrDefault(x => x.ID == bbnt.IDYC);
            ycpv.SoNgay -= 1;
            //bbnt.DoanhThu = bbnt.DoanhThu - (ct.DichVu_SanPham.DonGia * ct.SoLuong);
            db.SaveChanges();
            return Json(new
            {
                status = true
            });
        }

        public JsonResult Complete(long idyc, DateTime? ngaylamtiep)
        {
            var ycpv = db.YeuCauPhucVus.Find(idyc);
            if (!String.IsNullOrEmpty(ngaylamtiep.ToString()))
            {
                ycpv.NgayLamTiep = Convert.ToDateTime(ngaylamtiep.HasValue ? ngaylamtiep.Value.ToString("dd/MM/yyyy") : "null");
                db.SaveChanges();
            }
            else
            {
                ycpv.NgayLamTiep = null;
                db.SaveChanges();
            }
            return Json(new
            {
                status = true
            });
        }
        

        public JsonResult LoadKTV(long idbbnt)
        {
            
            List<ListKTVphutrach> list = new List<ListKTVphutrach>();
            List<KTV_BBNT> rs = db.KTV_BBNT.Where(x=>x.IDBBNT == idbbnt).ToList();
            foreach(KTV_BBNT item in rs)
            {
                ListKTVphutrach ktv = new ListKTVphutrach();
                ktv.ID = item.ID;
                ktv.TenKTV = item.NhanVien.TenKTV;
                ktv.Diem = float.Parse(item.Diem.ToString());
                ktv.DanhGia = item.DanhGia;
                list.Add(ktv);
            }
            return Json(new {
                data = list,
                status = true
            },JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ThemKTV(long idktv, long idbbnt, string diem, string dg)
        {
            var rs = db.NhanViens.Find(idktv);
            if (rs == null)
                return Json(new { status = false });
            else
            {
                KTV_BBNT a = new KTV_BBNT();
                a.IDBBNT = (int)idbbnt;
                a.IDUser = (int)idktv;
                a.Diem = Double.Parse(diem.ToString(), CultureInfo.InvariantCulture);
                a.DanhGia = dg;
                a.Status = true;
                db.KTV_BBNT.Add(a);
                db.SaveChanges();
                return Json(new
                {
                    status = true,
                    id = a.ID,
                    data = rs.TenKTV
                });
            }
        }
        [HttpPost]
        public JsonResult XoaKTV(long id)
        {
            var rs = db.KTV_BBNT.Find(id);
            db.KTV_BBNT.Remove(rs);
            db.SaveChanges();
            return Json(new
            {
                status = true
            });
        }
        [HttpPost]
        public JsonResult DropDownMayPV(string s, long idkh, long idyc)
        {
            //long idkh = long.Parse(Request.QueryString["kh"].ToString());
            var ycpv = db.YeuCauPhucVus.Find(idyc);
            List<MayLanh> list = new List<MayLanh>();
            if (ycpv.Loai != 2)
            {
                var rs = db.MayLanhs.Where(x => x.IDKhachHang == idkh && x.Status == 1 && (x.TenMay.Contains(s) || x.Model.Contains(s) || x.ViTri.Contains(s))).ToList();
                foreach (var item in rs)
                {
                    MayLanh kh = new MayLanh();
                    kh.ID = item.ID;
                    kh.TenMay = item.TenMay;
                    kh.Model = item.Model;
                    kh.ViTri = item.ViTri;
                    list.Add(kh);
                }
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var rs = db.MayLanhs.Where(x => x.IDKhachHang == 1 && x.Status == 1 && (x.TenMay.Contains(s) || x.Model.Contains(s) || x.ViTri.Contains(s))).ToList();
                foreach (var item in rs)
                {
                    MayLanh kh = new MayLanh();
                    kh.ID = item.ID;
                    kh.TenMay = item.TenMay;
                    kh.Model = item.Model;
                    kh.ViTri = item.ViTri;
                    list.Add(kh);
                }
                return Json(list, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult DropDownDV(string s)
        {
            //long idkh = long.Parse(Request.QueryString["kh"].ToString());
            List<DichVu_SanPham> list = new List<DichVu_SanPham>();
            var rs = db.DichVu_SanPham.Where(x => x.Status == true && (x.MaDV_SP.Contains(s) || x.TenDichVu_SanPham.Contains(s))).ToList();
            foreach (var item in rs)
            {
                DichVu_SanPham kh = new DichVu_SanPham();
                kh.ID = item.ID;
                kh.MaDV_SP = item.MaDV_SP;
                kh.TenDichVu_SanPham = item.TenDichVu_SanPham;
                list.Add(kh);
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult DropDownKTV(string s)
        {
            //long idkh = long.Parse(Request.QueryString["kh"].ToString());
            List<NhanVien> list = new List<NhanVien>();
            var rs = db.NhanViens.Where(x => x.TenKTV.Contains(s) || x.SDT.Contains(s)).ToList();
            foreach (var item in rs)
            {
                NhanVien nv = new NhanVien();
                nv.ID = item.ID;
                nv.TenKTV = item.TenKTV;
                nv.SDT = item.SDT;
                list.Add(nv);
            }
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        //Kiểm tra tồn tại và status là 1: có sẵn
        public bool checkMay(string maylanh, int idkh)
        {
            if(maylanh.ToUpper().Equals("ALL"))
            {
                return true;
            }
            List<string> tenmay = maylanh.Split(',').ToList();
            foreach (string s in tenmay)
            {
                var ml = db.MayLanhs.Where(x => x.Ma.ToUpper().Equals(s.ToUpper()) && x.IDKhachHang == idkh && x.Status == 1).Count();
                if (ml == 0)
                    return false;
                //////o day
            }
            return true;
        }

        [HttpPost]
        public JsonResult ThemCTBBNT(string iddv, int idkh, long idyc, string maylanh)
        {
            //long idkh = long.Parse(Request.QueryString["kh"].ToString());
            var ycpv = db.YeuCauPhucVus.Find(idyc);
            if (ycpv.Loai != 2)
            {
                if (checkMay(maylanh, idkh) == false) 
                {
                    return Json(new
                    {
                        status = false,
                        mess = "Không tìm thấy mã máy lạnh"
                    });
                }
                var dv = db.DichVu_SanPham.SingleOrDefault(x=>x.MaDV_SP.Equals(iddv));
                if (dv == null)
                    return Json(new { status = false, mess = "Không tìm thấy dịch vụ" });
                else
                {
                    DichVu_SanPham dvsp = new DichVu_SanPham();
                    dvsp.ID = dv.ID;
                    dvsp.MaDV_SP = dv.MaDV_SP;
                    dvsp.TenDichVu_SanPham = dv.TenDichVu_SanPham;
                    return Json(new
                    {
                        status = true,
                        datadv = dvsp
                    });
                }
            }
            else
            {
                if(checkMay(maylanh,1) == false)
                    return Json(new
                    {
                        status = false,
                        mess="Không tìm thấy mã máy lạnh"
                    });
                var dv = db.DichVu_SanPham.SingleOrDefault(x => x.MaDV_SP.Equals(iddv));
                if (dv == null)
                    return Json(new { status = false, mess="Không tìm thấy dịch vụ" });
                else
                {
                    DichVu_SanPham dvsp = new DichVu_SanPham();
                    dvsp.ID = dv.ID;
                    dvsp.MaDV_SP = dv.MaDV_SP;
                    dvsp.TenDichVu_SanPham = dv.TenDichVu_SanPham;
                    return Json(new
                    {
                        status = true,
                        datadv = dvsp
                    });
                }
            }
        }

        public void themMayLanhThuocCTBBNT(string maylanh, int idkh, CTBienBanNghiemThu ct)
        {
            List<string> tenmay = maylanh.Split(',').ToList();
            foreach (string s in tenmay)
            {
                CTBBNT_MayLanh cTBBNT_MayLanh = new CTBBNT_MayLanh();
                MayLanh ml = db.MayLanhs.SingleOrDefault(x => x.Ma.ToUpper().Equals(s.ToUpper()) && x.IDKhachHang == idkh && x.Status == 1);
                //if (ml != null)
                //{
                    cTBBNT_MayLanh.IDCTBBNT = ct.ID;
                    cTBBNT_MayLanh.IDMay = ml.ID;
                    if (idkh == 1 && ct.BienBanNghiemThu.YeuCauPhucVu.Loai == 2)
                        ml.Status = 2;
                    db.CTBBNT_MayLanh.Add(cTBBNT_MayLanh);
                    db.SaveChanges();
                //}

            }
        }

        [HttpPost]
        public JsonResult LuuCTBBNT(List<CTBienBanNghiemThu>list, int idkh, int idbbnt)
        {
            var bbnt = db.BienBanNghiemThus.Find(idbbnt);
            var yeucau = db.YeuCauPhucVus.SingleOrDefault(x => x.ID == bbnt.IDYC);
            foreach (CTBienBanNghiemThu item in list)
            {
                var dv = db.DichVu_SanPham.SingleOrDefault(x=>x.MaDV_SP.Equals(item.IDDichVuJSON.ToString()) && x.Status==true);
                item.IDDichVu = dv.ID;
                item.IDBBNT = idbbnt;
                if(item.Diem == null)
                    item.Diem = Double.Parse(item.DiemJSON.ToString(), CultureInfo.InvariantCulture);
                if (item.MayLanh.ToUpper().Equals("ALL"))
                {
                    string s = "";
                    if (yeucau.Loai == 2)
                    {
                        idkh = 1;
                    }
                    List<MayLanh> listML = db.MayLanhs.Where(x => x.IDKhachHang == idkh && x.Status == 1).ToList();
                    if (listML.Count == 0)
                        return Json(new { status = false, mess = "Không tìm thấy mã máy" });
                    for (int i = 0; i < listML.Count; i++)
                    {
                        if (s == "")
                            s = listML[i].Ma;
                        else
                            s = s + "," + listML[i].Ma;
                    }
                    item.MayLanh = s;
                }
                //ct.IDMay = int.Parse(idmay);
                //var dv = db.DichVu_SanPham.Find(ct.IDDichVu);
                //BienBanNghiemThu bbnt = db.BienBanNghiemThus.Find(idbbnt);
                //bbnt.DoanhThu = bbnt.DoanhThu + tt;
                db.CTBienBanNghiemThus.Add(item);
                db.SaveChanges();
                try
                {
                    if (yeucau.Loai == 2)
                    {
                        themMayLanhThuocCTBBNT(item.MayLanh, 1, item);
                    }
                    else
                        themMayLanhThuocCTBBNT(item.MayLanh, idkh, item);
                }
                catch
                {
                    return Json(new
                    {
                        status = false,
                        mess = "Máy hiện không có sẵn trong kho"
                    });
                }
            }
            return Json(new
            {
                status = true,
            });
        }

        [HttpPost]
        public JsonResult Update(string ctbbnt,string diem, int kh, int ycpv)
        {
            YeuCauPhucVu yeucau = db.YeuCauPhucVus.Find(ycpv);
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            CTBienBanNghiemThu ctbbnt_edit = serializer.Deserialize<CTBienBanNghiemThu>(ctbbnt);
            CTBienBanNghiemThu ct = db.CTBienBanNghiemThus.SingleOrDefault(x => x.ID == ctbbnt_edit.ID);
            //ct.IDMay = ctbbnt_edit.IDMay;
            ct.MayLanh = ctbbnt_edit.MayLanh;
            ct.SoLuong = ctbbnt_edit.SoLuong;
            ct.GhiChu = ctbbnt_edit.GhiChu;
            ct.CPDauVao = ctbbnt_edit.CPDauVao;
            ct.Diem = Double.Parse(diem.ToString(), CultureInfo.InvariantCulture);
            ct.DonGia = ctbbnt_edit.DonGia;
            List<CTBBNT_MayLanh> list = db.CTBBNT_MayLanh.Where(x => x.IDCTBBNT == ct.ID).ToList();
            foreach (CTBBNT_MayLanh ctml in list)
            {
                MayLanh ml = db.MayLanhs.SingleOrDefault(x => x.ID == ctml.IDMay);
                ml.Status = 1;
                db.CTBBNT_MayLanh.Remove(ctml);
            }
            try {
                if (yeucau.Loai == 2)
                {
                    themMayLanhThuocCTBBNT(ct.MayLanh, 1, ct);
                }
                else
                    themMayLanhThuocCTBBNT(ct.MayLanh, kh, ct);
            }
            catch
            {
                return Json(new
                {
                    status = false,
                    mess = "Vui lòng kiểm tra mã máy"
                });
            }
            
            db.SaveChanges();
            return Json(new
            {
                status = true
            });
        }

        [HttpPost]
        public JsonResult LoadBBNT(int idyc)
        {
            var rs = db.CTBienBanNghiemThus.Where(x => x.BienBanNghiemThu.IDYC == idyc).ToList();
            double tongtien = double.Parse(db.BienBanNghiemThus.Where(x => x.IDYC == idyc).Sum(x => x.DoanhThu).ToString());
            if (rs != null)
            {
                List<CTBBNTnew> list = new List<CTBBNTnew>();
                foreach (CTBienBanNghiemThu item in rs)
                {
                    CTBBNTnew ct = new CTBBNTnew();
                    ct.ID = item.ID;
                    ct.TenDVSP = item.DichVu_SanPham.TenDichVu_SanPham;
                    ct.DonGia = int.Parse(item.DonGia.ToString());
                    ct.SoLuong = int.Parse(item.SoLuong.ToString());
                    ct.Ma = item.MayLanh;
                    ct.CPDauVao = item.CPDauVao.HasValue? item.CPDauVao.Value : 0;
                    ct.GhiChu = item.GhiChu;
                    ct.NgayPV = item.BienBanNghiemThu.NgayLap.Value.ToString("dd/MM/yyyy");
                    list.Add(ct);
                }
                return Json(new
                {
                    status = true,
                    data = list,
                    tt=tongtien.ToString("N0"),
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new
                {
                    status = false
                });
            }
        }

        [HttpGet]
        public JsonResult LoadCPPX(int idyc)
        {
            int index = 0;
            var rs = db.CTPhieuXuatVatTu_KTV.Where(x => x.PhieuXuatVatTu_KTV.YeuCauPhucVu.ID == idyc).ToList();
            double tt = 0;
            if (rs != null)
            {
                List<ChiPhiXuatKho> list = new List<ChiPhiXuatKho>();
                foreach(CTPhieuXuatVatTu_KTV item in rs)
                {
                    ChiPhiXuatKho ct = new ChiPhiXuatKho();
                    ct.ID=++index;
                    ct.TenVatTu = item.VatTu.TenVatTu;
                    ct.TenKTV =item.PhieuXuatVatTu_KTV.NhanVien.TenKTV;
                    ct.DonGia = float.Parse(item.DonGia.ToString());
                    ct.SoLuongLay = float.Parse(item.SLLay.ToString());
                    if (item.SLThucTe != null || item.SLThucTe > 0)
                        ct.SoLuongTT = float.Parse(item.SLThucTe.ToString());
                    else
                        ct.SoLuongTT = float.Parse(item.SLLay.ToString());
                    ct.ThanhTien = ct.DonGia * ct.SoLuongTT;
                    tt = tt + ct.ThanhTien;
                    list.Add(ct);
                }
                return Json(new
                {
                    status = true,
                    tt = tt.ToString("N0"),
                    data = list
                }, JsonRequestBehavior.AllowGet);;
            }
            else
            {
                return Json(new
                {
                    status = false
                });
            }
        }

        [HttpPost]
        public JsonResult ThemChiPhi(int idyc, string tenCP, int soluong, float dongia, string ghichu)
        {
            ChiPhiKhac cpk = new ChiPhiKhac();
            cpk.IDYCPV = idyc;
            cpk.TenChiPhi = tenCP;
            cpk.SoLuong = soluong;
            cpk.DonGia = dongia;
            cpk.GhiChu = ghichu;
            db.ChiPhiKhacs.Add(cpk);
            db.SaveChanges();
            return Json(new
            {
                status = true,
                id = cpk.ID
            }) ;
        }

        [HttpPost]
        public JsonResult XoaChiPhi(long id)
        {
            var rs = db.ChiPhiKhacs.Find(id);
            db.ChiPhiKhacs.Remove(rs);
            db.SaveChanges();
            return Json(new
            {
                status = true
            });
        }

        [HttpPost]
        public JsonResult LoadCPKhac(int idyc)
        {
            var rs = db.ChiPhiKhacs.Where(x => x.IDYCPV == idyc).ToList();
            double tt = 0;
            if (rs != null)
            {
                List<ChiPhiKhac> list = new List<ChiPhiKhac>();
                foreach (ChiPhiKhac item in rs)
                {
                    ChiPhiKhac ct = new ChiPhiKhac();
                    ct.ID = item.ID;
                    ct.IDYCPV = item.IDYCPV;
                    ct.TenChiPhi = item.TenChiPhi;
                    ct.DonGia = float.Parse(item.DonGia.ToString());
                    ct.SoLuong = int.Parse(item.SoLuong.ToString());
                    ct.GhiChu = item.GhiChu;
                    tt = tt + (ct.DonGia.Value * ct.SoLuong.Value);
                    list.Add(ct);
                }
                return Json(new
                {
                    status = true,
                    tt = tt.ToString("N0"),
                    data = list,
                }, JsonRequestBehavior.AllowGet);;
            }
            else
            {
                return Json(new
                {
                    status = false
                });
            }
        }

        [HttpPost]
        public JsonResult updateMaBBNT(int idbbnt, long ma)
        {
            BienBanNghiemThu bbnt = db.BienBanNghiemThus.Find(idbbnt);
            bbnt.Ma = ma;
            db.SaveChanges();
            return Json(new{status =true, mess ="Cập nhật thành công" });
        }

        [HttpPost]
        public JsonResult getDV(string madv)
        {
            var dv = db.DichVu_SanPham.Single(x => x.MaDV_SP.Equals(madv) && x.Status == true);
            return Json(new
            {
                status = true,
                dongia = dv.DonGia,
                diem = dv.Diem
            });
        }

        [HttpPost]
        public JsonResult getDsMay(int idkh,int idyc,string iddv)
        {
            var ycpv = db.YeuCauPhucVus.Find(idyc);
            List<MayLanh> list = new List<MayLanh>();
            List<MayLanh> rs = db.MayLanhs.ToList();
            if (ycpv.Loai == 2 )
            {
                rs = rs.Where(x => x.IDKhachHang == 1 && x.Status == 1 && x.IDDichVu.Equals(iddv)).ToList();
            }
            else
                rs = rs.Where(x => x.IDKhachHang == idkh && x.Status == 1).ToList();
            foreach(MayLanh item in rs)
            {
                MayLanh ml = new MayLanh();
                ml.ID = item.ID;
                ml.Ma = item.Ma;
                ml.ViTri = item.ViTri;
                ml.TenMay = item.TenMay;
                list.Add(ml);
            }
            return Json(new {
                status=true,
                data=list
            },JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult refreshDataML(string madv, int idyc)
        {
            var ycpv = db.YeuCauPhucVus.Find(idyc);
            if( ycpv.Loai == 2)
            {
                var ml = db.MayLanhs.Where(x => x.IDDichVu.Equals(madv) && x.Status == 1);
                List<MayLanh> list = new List<MayLanh>();
                foreach(MayLanh item in ml)
                {
                    MayLanh mayLanh = new MayLanh();
                    mayLanh.ID = item.ID;
                    mayLanh.Ma = item.Ma;
                    mayLanh.ViTri = item.ViTri;
                    mayLanh.TenMay = item.TenMay;
                    list.Add(mayLanh);
                }
                return Json(new {
                    status=true,
                    data=list
                },JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { status = false});
        }
    }
}