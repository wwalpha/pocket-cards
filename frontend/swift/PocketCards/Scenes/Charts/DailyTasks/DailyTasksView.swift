//
//  ChartsView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//
//

import SwiftUI

struct DailyTasksView: View {
    var interactor: DailyTasksBusinessLogic?

    @ObservedObject var viewModel = DailyTasksViewModel()

    var body: some View {
        GeometryReader { geo in
            VStack(spacing: 20) {
                Spacer()

                Text("理科")
                    .padding()
                    .padding(.leading, 32)
                    .font(.system(size: 28))
                    .frame(width: geo.size.width, height: 48, alignment: .leading)
                    .background(Color.science)
                    .foregroundColor(Color.white)

                Dailytasks(target: viewModel.sciTarget, completed: viewModel.sciArchive)
                    .padding(.leading, 32)

                Text("社会")
                    .padding()
                    .padding(.leading, 32)
                    .font(.system(size: 28))
                    .frame(width: geo.size.width, height: 48, alignment: .leading)
                    .background(Color.society)
                    .foregroundColor(Color.white)

                Dailytasks(target: viewModel.socTarget, completed: viewModel.socArchive)
                    .padding(.leading, 32)

                Text("国語")
                    .padding()
                    .padding(.leading, 32)
                    .font(.system(size: 28))
                    .frame(width: geo.size.width, height: 48, alignment: .leading)
                    .background(Color.language)
                    .foregroundColor(Color.white)

                Dailytasks(target: viewModel.lanTarget, completed: viewModel.lanArchive)
                    .padding(.leading, 32)

                Spacer()
            }
        }
    }
}

extension DailyTasksView: DailyTasksDisplayLogic {
    func showTasks(model: DailyTasksViewModel) {
        viewModel.lanTarget = model.lanTarget
        viewModel.lanArchive = model.lanArchive
        viewModel.sciTarget = model.sciTarget
        viewModel.sciArchive = model.sciArchive
        viewModel.socTarget = model.socTarget
        viewModel.socArchive = model.socArchive
    }
}

extension DailyTasksView {
    func configureView() -> some View {
        var view = self
        let interactor = DailyTasksInteractor()
        let presenter = DailyTasksPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        return view
    }
}

struct ChartsView_Previews: PreviewProvider {
    static var previews: some View {
        DailyTasksView()
            .previewInterfaceOrientation(.landscapeLeft)
    }
}
