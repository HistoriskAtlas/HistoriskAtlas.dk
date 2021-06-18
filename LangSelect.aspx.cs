using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


namespace HistoriskAtlas5.Frontend
{
    public partial class LangSelect : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        public HAGeo GetGeo(int geoid) {
            //return (new Service<HAGeos>()).Get("geo.json?v=1&schema={geo:[id,title]}&geoid=" + geoid + "&online=true").data[0];
            return (new Service<HAGeo>()).GetHAAPI($"geo/{geoid}", "deeplink", "online=true");
        }

    }
}