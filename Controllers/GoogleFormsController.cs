using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GoogleFormAnswerGenerator.Models.GoogleForm;
using GoogleFormAnswerGenerator.Services;

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
    }
}
