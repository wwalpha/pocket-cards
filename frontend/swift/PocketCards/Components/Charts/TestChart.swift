//
//  TestChart.swift
//  PocketCards
//
//  Created by macmini on 2022/03/24.
//

import Charts
import SwiftUI

struct TestChart: UIViewRepresentable {
    func makeUIView(context _: Context) -> LineChartView {
        let yVals1 = [
            ChartDataEntry(x: Double(2), y: 10),
            ChartDataEntry(x: Double(3), y: 30),
            ChartDataEntry(x: Double(5), y: 40),
        ]

        let formatter = NumberFormatter()
        formatter.generatesDecimalNumbers = false

        let set1 = LineChartDataSet(entries: yVals1, label: "国 語")
        set1.setColor(UIColor(red: 190 / 255, green: 32 / 255, blue: 47 / 255, alpha: 1))
        set1.valueFont = .systemFont(ofSize: 16)
        set1.lineWidth = 3
        set1.drawCirclesEnabled = false
        set1.valueFormatter = DefaultValueFormatter(decimals: 0)

        //        set1.setColor(.black)
        //        set1.setCircleColor(.black)
        //        set1.valueFont = .systemFont(ofSize: 9)
        //        set1.formLineDashLengths = [5, 2.5]
        //        set1.formLineWidth = 1
        //        set1.formSize = 15

        let data = LineChartData(dataSet: set1)

        //        data.setValueTextColor(.white)

        let chartView = LineChartView()
        //        chartView.chartDescription?.enabled = false
        chartView.dragEnabled = false
        chartView.setScaleEnabled(false)
        chartView.pinchZoomEnabled = false

        let xAxis = chartView.xAxis
        xAxis.labelFont = .systemFont(ofSize: 11)
        xAxis.labelTextColor = .white
        xAxis.drawAxisLineEnabled = false
        xAxis.drawGridLinesEnabled = false
        xAxis.enabled = true
        xAxis.axisMinimum = 1
        xAxis.axisMaximum = 6

        let leftAxis = chartView.leftAxis
        //        leftAxis.labelTextColor = UIColor(red: 51 / 255, green: 181 / 255, blue: 229 / 255, alpha: 1)
        leftAxis.labelFont = .systemFont(ofSize: 14)
        leftAxis.axisMaximum = 100
        leftAxis.axisMinimum = 0
        leftAxis.granularityEnabled = true
        leftAxis.valueFormatter = DefaultAxisValueFormatter(formatter: formatter)

        let rightAxis = chartView.rightAxis
        rightAxis.enabled = false
        //        rightAxis.labelTextColor = .red
        //        rightAxis.axisMaximum = 900
        //        rightAxis.axisMinimum = -200
        //        rightAxis.granularityEnabled = false

        //        chartView.animate(xAxisDuration: 2.5)

        //        chartView.legend.font = UIFont(name: "HelveticaNeue-Light", size: 16)!

        let legend = chartView.legend
        legend.form = .square
        legend.formSize = CGFloat(16.0)
        legend.font = UIFont(name: "HelveticaNeue-Light", size: 16)!
        legend.horizontalAlignment = .left
        legend.verticalAlignment = .bottom
        legend.orientation = .horizontal
        legend.drawInside = false

//        chartView.legend.horizontalAlignment = .right
//        chartView.legend.verticalAlignment = .top
//        chartView.legend.orientation = .vertical
        chartView.animate(yAxisDuration: 1)

        chartView.extraLeftOffset = 24
        chartView.extraTopOffset = 12
        chartView.extraRightOffset = 24
        chartView.extraBottomOffset = 12

        chartView.data = data

        return chartView
    }

    func updateUIView(_: LineChartView, context _: Context) {
        // 値が更新された時に呼び出される処理
    }
}
