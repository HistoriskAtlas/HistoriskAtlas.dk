using Svg;
using Svg.Transforms;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace HistoriskAtlas5.Frontend
{
    public class Markers
    {
        static int markerSize = 24;
        static int markersPerRow = 10;
        static float scaleFactor = 1f;
        public static void Create()
        {
            string basePath = AppDomain.CurrentDomain.BaseDirectory + "images\\markers";
            string outputFile = basePath + "\\all.png";

            if (File.Exists(outputFile))
                return;

            string[] svgFiles = (Directory.GetFiles(AppDomain.CurrentDomain.BaseDirectory + "images\\markers", "tag*.svg"));
            string[] pngFiles = (Directory.GetFiles(AppDomain.CurrentDomain.BaseDirectory + "images\\markers", "tag*.png"));

            using (Bitmap outputBmp = new Bitmap(markersPerRow * markerSize, ((svgFiles.Length + pngFiles.Length) / markersPerRow + 1) * markerSize))
            {
                int i = 0;
                foreach (string file in svgFiles)
                {
                    SvgDocument svg = SvgDocument.Open(file);

                    foreach (SvgElement elem in svg.Children)
                        if (elem is SvgPath)
                            (elem as SvgPath).Fill = new SvgColourServer(Color.White);

                    svg.Transforms = new SvgTransformCollection();
                    float w = svg.Width.ToDeviceValue();
                    float h = svg.Height.ToDeviceValue();
                    float specificScaleFactor = (markerSize * scaleFactor) / Math.Max(svg.Width, svg.Height);
                    if (svg.Width > svg.Height)
                    {
                        svg.Transforms.Add(new SvgTranslate(0, (svg.Width - svg.Height) / (2f / specificScaleFactor)));
                        svg.Height = svg.Width;
                    } else {
                        svg.Transforms.Add(new SvgTranslate((svg.Height - svg.Width) / (2f / specificScaleFactor), 0));
                        svg.Width = svg.Height;
                    }
                    if (svg.Width.Type != SvgUnitType.Percentage)
                        svg.Transforms.Add(new SvgScale(specificScaleFactor, specificScaleFactor));
                    svg.Width = markerSize * scaleFactor;
                    svg.Height = svg.Width;
                    Bitmap bmp = svg.Draw();

                    int x = (i % markersPerRow) * markerSize;
                    int y = (i / markersPerRow) * markerSize;
                    using (Graphics g = Graphics.FromImage(outputBmp))
                        g.DrawImage(bmp, x, y, markerSize, markerSize);

                    int idStart = file.IndexOf("\\tag") + 4;
                    int id = Int32.Parse(file.Substring(idStart, file.Length - idStart - 4));
                    outputBmp.SetPixel(x, y, Color.FromArgb(id % 256, 255, 255, 255));
                    outputBmp.SetPixel(x + markerSize - 1, y, Color.FromArgb(id / 256, 255, 255, 255));
                    i++;
                }
                foreach (string file in pngFiles)
                {
                    var bmp = Image.FromFile(file);

                    int x = (i % markersPerRow) * markerSize;
                    int y = (i / markersPerRow) * markerSize;
                    using (Graphics g = Graphics.FromImage(outputBmp))
                        g.DrawImage(bmp, x, y, markerSize, markerSize);

                    int idStart = file.IndexOf("\\tag") + 4;
                    int id = Int32.Parse(file.Substring(idStart, file.Length - idStart - 4));
                    outputBmp.SetPixel(x, y, Color.FromArgb(id % 256, 255, 255, 255));
                    outputBmp.SetPixel(x + markerSize - 1, y, Color.FromArgb(id / 256, 255, 255, 255));
                    i++;
                }

                outputBmp.Save(outputFile, ImageFormat.Png);
            }
        }
    }
}