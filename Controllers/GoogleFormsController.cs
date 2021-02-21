using System.Threading.Tasks;
using System.Net.Http;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using GoogleFormAnswerGenerator.Models.GoogleForm;
using GoogleFormAnswerGenerator.Services;
using HtmlAgilityPack;

namespace GoogleFormAnswerGenerator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoogleFormsController : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] GoogleFormPostRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var googleForms = new GoogleFormsSubmissionService(
                request.FormUrl, request.Fields,request.Checkboxes
            );

            var result = await googleForms.SubmitAsync();
            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult> Get(string formUrl, int numberOfPages = 1)
        {
            /// Add multiple pages support.
            var parameters = new Dictionary<string, string>();
            var pageHistory = string.Join(',', Enumerable.Range(0, numberOfPages));
            parameters.Add("pageHistory", pageHistory);

            /// Try to post a fault request to the form to get questions & answers data.
            var httpClient = new HttpClient();
            var response = await httpClient.PostAsync(formUrl, new FormUrlEncodedContent(parameters));
            var rawHtml = await response.Content.ReadAsStringAsync();

            /// Get data in <script> in script node. 
            var htmlDocument = new HtmlDocument();
            htmlDocument.LoadHtml(rawHtml);
            var script = htmlDocument
                .DocumentNode
                .Descendants()
                .Where(n => n.Name.Equals("script"))
                .Select(sn => sn.InnerText)
                .Where(it => it.Contains("FB_PUBLIC_LOAD_DATA_"))
                .FirstOrDefault();

            return Ok(script);
        }
    }
}
